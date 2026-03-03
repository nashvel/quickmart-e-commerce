<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Product\Product;
use App\Models\Store\Store;
use App\Models\Product\Category;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_products_page_loads(): void
    {
        $response = $this->get('/products');
        $response->assertStatus(200);
    }

    public function test_products_page_has_products(): void
    {
        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Products/Index')
                ->has('products')
        );
    }

    public function test_product_detail_page_loads(): void
    {
        $product = Product::first();

        $response = $this->get("/products/{$product->id}");
        $response->assertStatus(200);
    }

    public function test_products_can_be_searched(): void
    {
        $response = $this->get('/api/products?search=mouse');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'products',
            'pager'
        ]);
    }

    public function test_products_can_be_filtered_by_category(): void
    {
        $category = Category::first();

        $response = $this->get("/api/products?category_id={$category->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'products',
            'pager'
        ]);
    }
}
