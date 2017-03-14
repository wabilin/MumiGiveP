#!/bin/bash

ver="$1"
os="$2"
name_head="MumiGiveP_"
    mumi_path="../mumi/mumi.py"

function make_bin_zip {
    options="$1"
    tail="$2"

    n_name="$name_head$ver"
    z_name="$n_name""_""$os$tail"

    pyinstaller $options $mumi_path
    cp ../README.md ./dist
    cp ../THANKS.md ./dist

    rm -r build
    mv ./dist "./$n_name"

    if [ "$os" == "win" ]; then
        7z a -tzip $z_name $n_name
    else
        zip -r -X $z_name $n_name
    fi

    rm -r $n_name
}

if [ "$#" -lt "2" ]; then
    echo "need a least 2 args"
    echo "Get: $# ."

else
    make_bin_zip "--onefile --noconsole" ".zip"
    make_bin_zip "" "_console.zip"
fi

