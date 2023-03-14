
cd ./service
nohup yarn start > service.log &
echo "Start service complete!"


cd ..
echo "" > front.log
nohup yarn dev > front.log &
echo "Start front complete!"
tail -f front.log
