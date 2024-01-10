#!/bin/sh

# Lando/NextJS project setup script
# By: Bear at Revolt Media - https://github.com/chaoticbear
# Project: https://github.com/revoltmedia/lando-bedrock-nextjs-starter

FRONTEND_DIR='/app/frontend'

yes_or_no() {
    while true; do
        read -r yn
        case $yn in
            [Yy]*) return 0  ;;
            [Nn]*) echo "Aborted" ; return  1 ;;
        esac
    done
}

echo "Project name? (slug-case only): "
read -r PROJECT_NAME 

if [ -d "$FRONTEND_DIR" ]; then
    printf '\n
%s already exists. \n
Would you like to DELETE and recreate it? Otherwise this script exits. \n
THIS WILL DELETE ANY WORK YOU'\''VE DONE IN %s!!!\n
[y/n]' "$FRONTEND_DIR" "$FRONTEND_DIR"
    if yes_or_no; then
        rm -rf $FRONTEND_DIR

        if [ -d "$FRONTEND_DIR" ]; then
            printf '\n
Failed to delete %s\n
Most likely continuing will lead to more errors.\n
Would you like to continue anyway?\n
[y/n]' "$FRONTEND_DIR"
            if ! yes_or_no; then
                exit;
            fi
        fi
    else
        exit;
    fi
fi

printf 'Create NextJS project named %s in %s?\n
[y/n]' "$PROJECT_NAME" "$FRONTEND_DIR"
if yes_or_no; then
    
    su -c "mkdir $FRONTEND_DIR && 
            cd $FRONTEND_DIR && 
            yarn create next-app $PROJECT_NAME  \
            -e https://github.com/revoltmedia/rm-faust-scaffold"

    if [ -d "$FRONTEND_DIR/$PROJECT_NAME" ]; then
        SOURCE_DIR="$FRONTEND_DIR/$PROJECT_NAME"
        
        echo "Moving contents of $SOURCE_DIR to $FRONTEND_DIR"

        find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -exec mv -t $FRONTEND_DIR -- {} +
        rm -rf "$SOURCE_DIR"
    else
        echo "The NextJS project wasn't created"
        exit;
    fi
else
    exit;
fi