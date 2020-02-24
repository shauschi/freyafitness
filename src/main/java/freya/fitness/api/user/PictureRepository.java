package freya.fitness.api.user;

import freya.fitness.utils.Size;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PictureRepository extends JpaRepository<ProfilePicture, UUID> {

  Optional<ProfilePicture> findByUserIdAndSize(UUID id, Size size);

  /**
   * Will delete all entries for that given UUID.
   * @param id given id
   */
  void deleteByUserId(UUID id);

}
