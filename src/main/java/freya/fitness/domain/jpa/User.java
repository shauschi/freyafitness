package freya.fitness.domain.jpa;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "user", schema="public")
public class User {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(
      name = "UUID",
      strategy = "org.hibernate.id.UUIDGenerator"
  )
  private String id;

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

  @ManyToMany
  @JoinTable(
      name="user_role",
      joinColumns=@JoinColumn(name="user_id", referencedColumnName="id"),
      inverseJoinColumns=@JoinColumn(name="role_id", referencedColumnName="id"))
  private List<Role> roles;

}
