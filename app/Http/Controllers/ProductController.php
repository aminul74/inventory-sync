<?php

namespace App\Http\Controllers;

use App\Services\ProductsService;
use App\Services\SingleProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductsService $productsService,
                                private SingleProductService $productService)
    {
    }

    public function getProducts(Request $request)
    {
        $after = $request->query('after');
        $before = $request->query('before');
        
        $result = $this->productsService->getProducts($before, $after);
        return response()->json($result);
    }

    public function getProduct($id)
    {
        $result = $this->productService->getProduct($id);
        return response()->json($result);
    }

    public function updateProductVariants(Request $request)
    {
        $variants = $request->input('variants');
        $result = $this->productService->updateProductVariants($variants);
        return response()->json($result);
    }
}
