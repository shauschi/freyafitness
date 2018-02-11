package freya.fitness.repository.mongodb;

import freya.fitness.domain.mondodb.ProfilePicture;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfilePictureRepository extends MongoRepository<ProfilePicture, String> {

}
