package freya.fitness.config;

import com.mongodb.MongoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

  @Override
  public MongoClient mongoClient() {
    return new MongoClient("localhost");
  }

  @Override
  protected String getDatabaseName() {
    return "freyafitness";
  }

  @Bean
  public GridFsTemplate gridFsTemplate() throws Exception {
    return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
  }

}
