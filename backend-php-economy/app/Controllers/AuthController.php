<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Exception;

class AuthController extends ResourceController
{
    /**
     * OTP Verification Stub
     * POST /api/v1/auth/verify_otp
     */
    public function verifyOtp()
    {
        $phoneNumber = $this->request->getVar('phone_number');
        $otpCode = $this->request->getVar('otp_code');

        if (empty($phoneNumber) || empty($otpCode)) {
            return $this->failValidationError('Required payload: phone_number, otp_code.');
        }

        // Hardcoded stub value
        if ($otpCode !== '123456') {
            return $this->failUnauthorized('Invalid OTP Code submitted.');
        }

        try {
            $userModel = new UserModel();
            $user = $userModel->where('phone_number', $phoneNumber)->first();

            if (!$user) {
                return $this->failNotFound('Phone number not registered to any Elev8 accounts.');
            }

            // Mark phone as verified
            $userModel->update($user['id'], ['is_phone_verified' => true]);

            return $this->respond([
                'status' => 'success',
                'message' => 'OTP Verified. Phone number linked.'
            ]);

        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }
}
