#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Error: no arguments !'
    exit -1
fi


DIR=/srv/mail/$1
if [ -d "$DIR" ]; then
    echo '::Removing mailbox: $DIR'
    rm -rf $DIR
    echo '::Done'
    exit 0
else
    echo "Error: Directory not found: $DIR"
    exit 1
fi
