package freya.fitness.domain.jpa;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user", schema="public")
public class User {

  // TODO UUID
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Email
  @NotEmpty
  private String email;

  @NotEmpty
  private String firstName;

  @NotEmpty
  private String familyName;

  @NotNull
  private String password;

  private String profilePictureId;

  private LocalDateTime lastLogin;

  @CreatedDate
  private LocalDateTime accountCreationTime;

}
