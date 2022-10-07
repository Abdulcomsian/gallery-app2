<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Log;
use Illuminate\Support\Facades\Storage;

class LaterController extends Controller
{
    public function pics ($Code)
    {
       $photos = json_decode( Storage::disk('local')->get($Code . '.json') );
       
        #echo var_dump ($photos); exit;

        return view('later_pics', compact('photos'));
    }

    public function pics2 ($Code)
    {
       $photos = json_decode( Storage::disk('local')->get($Code . '.json') );
       
        #echo var_dump ($photos); exit;

        return view('later_pic2', compact('photos'));
    }
   

}