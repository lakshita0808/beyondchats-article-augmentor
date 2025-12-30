<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Article;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

class ScrapeBeyondChats extends Command
{
    protected $signature = 'scrape:beyondchats {--limit=5}';
    protected $description = 'Scrape last page of BeyondChats blogs and store oldest 5 articles';

    public function handle()
    {
        $limit = (int)$this->option('limit');
        $base = 'https://beyondchats.com/blogs/';
        $client = new Client(['timeout'=>20,'headers'=>['User-Agent'=>'Mozilla/5.0']]);

        $this->info("Fetching blog index: $base");
        $res = $client->get($base);
        $html = (string) $res->getBody();
        $crawler = new Crawler($html);

        // Attempt to find pagination and the last page link. Fallback: treat current page as the only page.
        $lastPageUrl = $base;
        $pagination = $crawler->filter('.pagination a'); // site-specific; adjust as needed
        if ($pagination->count()) {
            $links = $pagination->extract(['href']);
            $last = end($links);
            if ($last) $lastPageUrl = $last;
        }

        $this->info("Last page URL: $lastPageUrl");
        $res2 = $client->get($lastPageUrl);
        $crawler2 = new Crawler((string)$res2->getBody());

        // Find article links - adjust selectors to site structure
        $links = $crawler2->filter('a')->reduce(function(Crawler $node, $i){
            $href = $node->attr('href') ?? '';
            return str_contains($href, '/blogs/') && str_contains($href, '/');
        })->each(function(Crawler $node){
            return $node->attr('href');
        });

        $links = array_unique($links);
        // Keep only absolute URLs
        $links = array_map(function($l) use ($base){
            if (str_starts_with($l, 'http')) return $l;
            return rtrim('https://beyondchats.com', '/') . '/' . ltrim($l, '/');
        }, $links);

        // We'll fetch oldest by removing duplicates and reversing if needed
        $links = array_values($links);
        // try to pick the 5 oldest (on last page they should be older); take first $limit
        $selected = array_slice($links, 0, $limit);

        foreach($selected as $url) {
            try {
                $r = $client->get($url);
                $body = (string)$r->getBody();
                $c = new Crawler($body);

                // Try common article selectors: <article>, h1 title, main content selectors
                $title = $c->filterXPath('//h1')->count() ? trim($c->filterXPath('//h1')->first()->text()) : 'Untitled';
                $contentNode = null;
                if ($c->filter('article')->count()) $contentNode = $c->filter('article');
                else if ($c->filter('.post-content')->count()) $contentNode = $c->filter('.post-content');
                else $contentNode = $c->filter('body');

                $contentHtml = $contentNode->count() ? $contentNode->first()->html() : '';

                $slug = Str::slug($title).'-'.substr(md5($url),0,6);

                // Create or update
                $article = Article::firstOrCreate(['source_url'=>$url], [
                    'title'=>$title,
                    'slug'=>$slug,
                    'original_content'=>$contentHtml,
                    'scraped_at'=>now(),
                ]);
                $this->info("Saved: {$title}");
            } catch (\Exception $e) {
                $this->error("Error fetching $url : ".$e->getMessage());
            }
        }
        $this->info("Done.");
        return 0;
    }
}
