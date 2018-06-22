package freya.fitness.config;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

  private final ServerAddress serverAddress;
  private final MongoCredential credentials;
  private final String database = "freyafitness";

  public MongoConfig(
      @Value("${MONGO_HOST:localhost}") final String host,
      @Value("${MONGO_PORT:27017}") final Integer port,
      @Value("${MONGO_USR}") final String user,
      @Value("${MONGO_PSW}") final String password) {
    this.serverAddress = new ServerAddress(host, port);
    this.credentials = MongoCredential.createCredential(
        user, database, password.toCharArray());
  }

  @Override
  public MongoClient mongoClient() {
    final MongoClientOptions options = new MongoClientOptions.Builder().build();
    //return new MongoClient(serverAddress, credentials, options);
    return new MongoClient(serverAddress);
  }

  @Override
  protected String getDatabaseName() {
    return database;
  }

  @Bean
  public GridFsTemplate gridFsTemplate() throws Exception {
    return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
  }

}
