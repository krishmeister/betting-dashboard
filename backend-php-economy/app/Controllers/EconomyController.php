<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Services\LedgerService;
use App\Services\GovernanceService;
use App\Models\WalletModel;
use Exception;

class EconomyController extends ResourceController
{
    protected $ledgerService;
    protected $walletModel;

    public function __construct()
    {
        $this->ledgerService = new LedgerService();
        $this->walletModel = new WalletModel();
    }

    /**
     * Mint endpoint
     * POST /api/v1/economy/mint
     */
    public function mint()
    {
        $amount = $this->request->getVar('amount');
        $superAdminWalletId = $this->request->getVar('super_admin_wallet_id');

        if (empty($amount) || empty($superAdminWalletId)) {
            return $this->failValidationError('Required nodes: amount, super_admin_wallet_id.');
        }

        try {
            // Null sender acts as Genesis block mint
            $this->ledgerService->transferCredits(null, $superAdminWalletId, $amount, 'deposit');

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Credits minted successfully initialized.',
                'minted_amount' => $amount
            ]);
        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * Transfer endpoint
     * POST /api/v1/economy/transfer
     */
    public function transfer()
    {
        $senderId = $this->request->getVar('sender_id');
        $receiverId = $this->request->getVar('receiver_id');
        $amount = $this->request->getVar('amount');

        if (empty($senderId) || empty($receiverId) || empty($amount)) {
            return $this->failValidationError('Required nodes: sender_id, receiver_id, amount.');
        }

        try {
            $this->ledgerService->transferCredits($senderId, $receiverId, $amount, 'transfer');

            return $this->respond([
                'status' => 'success',
                'message' => 'Transfer pushed through hierarchy successfully.',
                'transfer_amount' => $amount
            ]);
        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * Balance retrieval endpoint
     * GET /api/v1/economy/balance/{wallet_id}
     */
    public function balance($walletId = null)
    {
        if (!$walletId) {
            return $this->failValidationError('Path parameter wallet_id cannot be null.');
        }

        $wallet = $this->walletModel->find($walletId);

        if (!$wallet) {
            return $this->failNotFound('Wallet resolution failed. Record not deployed.');
        }

        $balance = $wallet['balance'];
        $lockedBalance = $wallet['locked_balance'] ?? 0;
        $availableBalance = $balance - $lockedBalance;

        return $this->respond([
            'status' => 'success',
            'data' => [
                'wallet_id' => $walletId,
                'total_balance' => $balance,
                'locked_balance' => $lockedBalance,
                'available_balance' => $availableBalance,
                'currency' => $wallet['currency']
            ]
        ]);
    }

    /**
     * Settle Match Server-to-Server endpoint
     * POST /api/v1/economy/settle_match
     */
    public function settleMatch()
    {
        // Require Internal Service API Key (Server bridging)
        $authHeader = $this->request->getHeaderLine('Authorization');
        // Basic static bearer check: "Bearer development_internal_key"
        if ($authHeader !== 'Bearer development_internal_key') {
            return $this->failUnauthorized('Invalid SERVICE_API_KEY internal backend token provided.');
        }

        $matchId = $this->request->getVar('match_id');
        $winnerWalletId = $this->request->getVar('winner_wallet_id');
        $loserWalletId = $this->request->getVar('loser_wallet_id');
        $totalPool = $this->request->getVar('total_pool');
        $platformFeePercentage = $this->request->getVar('platform_fee_percentage');

        if (empty($matchId) || empty($winnerWalletId) || empty($totalPool) || empty($platformFeePercentage)) {
            return $this->failValidationError('Required nodes: match_id, winner_wallet_id, loser_wallet_id, total_pool, platform_fee_percentage.');
        }

        try {
            $this->ledgerService->settleMatch(
                $matchId,
                $winnerWalletId,
                $loserWalletId,
                (float) $totalPool,
                (float) $platformFeePercentage
            );

            return $this->respond([
                'status' => 'success',
                'message' => 'Match successfully settled. Multi-Tier Revenue split calculated.',
                'match_id' => $matchId
            ]);
        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * Manual Fiat Settlement
     * POST /api/v1/economy/manual_fiat_settlement
     */
    public function manualFiatSettlement()
    {
        $adminNodeId = $this->request->getVar('admin_node_id');
        $targetNodeId = $this->request->getVar('target_node_id');
        $targetWalletId = $this->request->getVar('target_wallet_id');
        $amount = $this->request->getVar('amount');

        if (empty($adminNodeId) || empty($targetNodeId) || empty($targetWalletId) || empty($amount)) {
            return $this->failValidationError('Required nodes: admin_node_id, target_node_id, target_wallet_id, amount.');
        }

        // Verify Governance Hierarchy
        $governanceService = new GovernanceService();
        if (!$governanceService->canAdministerNode($adminNodeId, $targetNodeId)) {
            return $this->failForbidden('Authorization failed. Admin node is not directly above the target node in the hierarchy chain.');
        }

        try {
            // Null sender implies we are injecting credits the admin paid for in fiat to the sub-node
            $this->ledgerService->transferCredits(null, $targetWalletId, $amount, 'MANUAL_FIAT');

            return $this->respond([
                'status' => 'success',
                'message' => 'Manual fiat settlement processed and credits distributed to sub-tier.',
                'distributed_amount' => $amount
            ]);
        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }
}
