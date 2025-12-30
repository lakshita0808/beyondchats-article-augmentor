<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    public function index(Request $r)
    {
        $perPage = $r->get('per_page', 20);
        return Article::orderBy('id','desc')->paginate($perPage);
    }

    public function show($id)
    {
        return Article::findOrFail($id);
    }

    public function store(Request $r)
    {
        $v = Validator::make($r->all(), [
            'title'=>'required|string',
            'original_content'=>'nullable|string',
            'source_url'=>'nullable|url'
        ]);
        if($v->fails()) return response($v->errors(),422);

        $slug = Str::slug($r->title).'-'.substr(md5(time()),0,6);
        $article = Article::create(array_merge($r->only(['title','original_content','source_url']), ['slug'=>$slug, 'scraped_at' => now()]));
        return response($article,201);
    }

    public function update(Request $r, $id)
    {
        $article = Article::findOrFail($id);
        $article->fill($r->only(['title','original_content','updated_content','source_url','references']));
        $article->save();
        return response($article,200);
    }

    public function destroy($id)
    {
        Article::findOrFail($id)->delete();
        return response(null,204);
    }
}
