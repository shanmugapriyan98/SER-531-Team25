# SER-531-Team25

##How to setup Fuseki server and host it on an AWS instance:

1. Aquire a free AWS ec2 instance, create a public key and ssh into the machine. Follow this tutorial: https://www.bobdc.com/blog/ec2fuseki/
2. Install Apache Jena Fuseki and install java on the machine (Steps in the above tutorial)
3. Verify that the fuseki server is running on the port 3030. (IP:3030, in out case - http://3.14.69.36:3030/)
4. Create an empty datatbase in the configuration folder of the apache jena fuseki path - apache-jena-fuseki-4.10.0/run/configuration
5. Use tdbloader to load data into the database.
6. Try some queries on the apache jena fuseki endpoint to check if its working

