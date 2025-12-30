<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title','slug','original_content','updated_content','source_url','references','scraped_at'
    ];

    protected $casts = [
        'references' => 'array',
        'scraped_at' => 'datetime',
    ];
}
