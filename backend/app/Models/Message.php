<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'email', 'phone', 'subject', 'message', 'read'])]
class Message extends Model
{
    protected function casts(): array
    {
        return ['read' => 'boolean'];
    }
}
