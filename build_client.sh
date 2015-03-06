cd client
gulp
gulp remove-proxy
cd ..
rsync -av --delete --exclude='index.html' client/www/ public/client/
cd client
gulp add-proxy
cd ..
git add --all .
git commit -m "client changes"
# git push