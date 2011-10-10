mvn -P compiled clean install
rm -rf target/robot/META-INF/
rm -rf target/robot/WEB-INF/
rm -rf pages/*
cp -r target/robot/* pages/
cd pages
git add -A
git commit -m "Pages update"