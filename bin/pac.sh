#!/bin/bash

ver="$1"
os="$2"

if [ "$#" -lt "2" ]; then
    echo "need a least 2 args"
    echo "Get: $# ."
else
    name_head="MumiGiveP_"
    mumi_path="../mumi/mumi.py"

    n_name="$name_head$ver"
    tail_1=".zip"
    tail_2="_console.zip"
    z_name="$n_name""_""$os$tail_1"

    # Normal version
    pyinstaller --onefile --noconsole $mumi_path
    cp ../README.md ./dist
    rm -r build
    mv ./dist "./$n_name"

    if [ "$os" == "win" ]; then
        7z a -tzip $z_name $n_name
    else
        zip -r -X $z_name $n_name
    fi

    rm -r $n_name


    # Console version
    z_name="$n_name""_""$os$tail_2"

    pyinstaller $mumi_path
    cp ../README.md ./dist
    rm -r build
    mv ./dist "./$n_name"

    if [ "$os" == "win" ]; then
        7z a -tzip $z_name $n_name
    else
        zip -r -X $z_name $n_name
    fi

    rm -r $n_name
fi

