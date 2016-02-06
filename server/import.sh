for i in `ls old_db/tb_*.csv`;
do 
	mongoimport -h localhost:3001 --db meteor --file $i --type csv --stopOnError --headerline;
done;
