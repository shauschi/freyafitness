package freya.fitness.domain.mondodb;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.io.File;

@Data
@NoArgsConstructor
@Document
public class ProfilePicture {

  @Id
  private String id;

  private File image;

  public ProfilePicture(final File image) {
    this.image = image;
  }

}
