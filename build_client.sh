cd client
gulp
gulp add-proxy
cd ..
rsync -av --delete --exclude='index.html' client/www/ public/client/
gulp remove-proxy
git add --all .
git commit -m "client changes"
# git push