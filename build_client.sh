cd client
gulp
cd ..
rsync -av --delete --exclude='index.html' client/www/ public/client/
git add --all .
git commit -m "client changes"
git push