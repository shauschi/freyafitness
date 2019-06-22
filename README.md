### Update the SSL Certificate
Steps to update the SSL certificate:
* download the *.cer file, e.g. `freya.fitness_ssl_certificate.cer`
* download the private key file, e.g. `*.freya.fitness_private_key.key`
* go to the folder
* execute `openssl pkcs12 -export -in freya.fitness_ssl_certificate.cer -inkey \*.freya.fitness_private_key.key -name freyafitness -out my.p12`
* choose a strong password
* upload the my.p12 to Jenkins and make sure you use the correct password
* deploy the application
* DONE 