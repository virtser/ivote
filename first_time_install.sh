# Install PostgreSQL
# http://postgresapp.com/

# Install server
gem install rails --version=4.1.6

rake db:migrate
rake db:seed


# Install client
sudo npm install -g cordova ionic
sudo npm install -g gulp
sudo npm install -g bower

cd client

npm install
bower install

cd ..

