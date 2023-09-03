#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Error: no arguments !'
    exit -1
fi


DIR=/srv/mail/$1/test/test
if [ -d "$DIR" ]; then
    echo '::Removing mailbox: $DIR'
    rm -rf $DIR
    echo '::Done'
else
    echo "Error: Directory not found: $DIR"
fi
