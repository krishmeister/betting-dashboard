<?php

namespace App\Models;

use CodeIgniter\Model;

class NodeModel extends Model
{
    protected $table = 'nodes';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'user_id',
        'node_type',
        'status',
        'parent_node_id'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'user_id' => 'required|integer',
        'node_type' => 'required|in_list[Super,Master,Franchisee,Sub_Franchisee]',
        'status' => 'in_list[active,inactive,suspended]',
        'parent_node_id' => 'permit_empty|integer'
    ];
}
