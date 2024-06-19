# Intelligent Route Optimization System
## RUN INSTRUCTIONS:
1. <b>Starting backend</b>: Go to ser531 folder, Do mvn clean install for the whole project first., run the Application.java file, you can see the spring boot application started message. It will run in server 8080.
2. <b>Starting front end</b>: Assuming you have all the necessary packages installed, run npm run dev. Your front end application will now start in server 3030.
3. <b>Starting apache-jena-fuseki-server</b>: The server is hosted on an AWS ec2 instance (IP: 13.59.179.215) which is currently running. So first we need to ssh into that system with the .pem keyfile. Our .pem key is in the root of the repository with the name <b>fuseki-key-pair.pem</b>. Please follow these commands.
    - ssh -i fuseki-key-pair.pem ec2-user@13.59.179.215  
      (Here please make sure you have the correct path for the downloaded .pem file. After we ssh into the system, it will ask if you want to continue, type yes. After that you will be at the root directory /home/ec2-user/)  
    - cd apache-jena-fuseki-4.10.0/ 
      (cd into the directly with the fuseki server start script)
    - ./fuseki-server 
      (Run the fuseki server. No arguments required. All the data is already loaded into our database 'abc')
    - In your browser go to http://13.59.179.215:3030 and you should be able to access the server, view and query the data.
  

## Appendix:

### How to setup Fuseki server and host it on an AWS instance:

1. Aquire a free AWS ec2 instance, create a public key and ssh into the machine. Follow this tutorial: https://www.bobdc.com/blog/ec2fuseki/
2. Install Apache Jena Fuseki and install java on the machine (Steps in the above tutorial)
3. Verify that the fuseki server is running on the port 3030. (IP:3030, in out case - http://3.14.69.36:3030/)
4. Create an empty datatbase in the configuration folder of the apache jena fuseki path - apache-jena-fuseki-4.10.0/run/configuration
5. Use tdbloader to load data into the database.
6. Try some queries on the apache jena fuseki endpoint to check if its working

We added the datasets to the Apache fuseki server, and with the data available, we explored numerous use cases with varying from and to locations. We obtained the results from our application as a list of gas stations and restaurants within the latitude and longitude. We intended to trim the list earlier, but utilizing the haversine formula in ontology appears to be a time-consuming operation at the moment. 


