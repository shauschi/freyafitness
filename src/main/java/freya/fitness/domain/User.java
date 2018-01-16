package freya.fitness.domain;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user", schema="public")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String email;

  private String firstName;

  private String familyName;

  private String password;

  private LocalDateTime lastLogin;

  private LocalDateTime accountCreationTime;

}
