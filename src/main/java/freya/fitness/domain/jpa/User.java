package freya.fitness.domain.jpa;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user", schema="public")
public class User {

  // TODO UUID
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;

  private String firstName;

  private String familyName;

  private String password;

  private String profilePictureId;

  private LocalDateTime lastLogin;

  private LocalDateTime accountCreationTime;

}
