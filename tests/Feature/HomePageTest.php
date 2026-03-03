<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Product\Product;
use App\Models\Product\Category;
use App\Models\Store\Store;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Run seeders
        $this->seed();
    }

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_home_page_has_featured_products(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Welcome')
                ->has('featuredProducts')
        );
    }

    public function test_home_page_has_categories(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Welcome')
                ->has('categories')
        );
    }

    public function test_home_page_has_stores(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Welcome')
                ->has('convenienceStores')
                ->has('restaurants')
        );
    }
}
