package freya.fitness.repository.mongodb;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@Repository
public class ProfilePictureRepository {

  private final Logger LOGGER = Logger.getLogger(ProfilePictureRepository.class);

  @Autowired
  private GridFsTemplate gridFsTemplate;

  public byte[] getById(final String profilePictureId) throws IOException {
    LOGGER.debug("get profile picture by id " + profilePictureId);
    if (profilePictureId == null) {
      return null;
    }

    final GridFSFile result = gridFsTemplate.findOne(whereId(profilePictureId));
    if (result == null) {
      final String message = "no profile picture available for " + profilePictureId;
      LOGGER.debug(message);
      return null;
    }
    final String filename = result.getFilename();
    final GridFsResource resource = gridFsTemplate.getResource(filename);
    try (final InputStream is = resource.getInputStream()){
      byte[] buffer = new byte[(int) resource.contentLength()];
      int bytes = is.read(buffer);
      LOGGER.debug(bytes + " bytes read");
      return buffer;
    }
  }

  public String save(final MultipartFile multipartFile) throws IOException {
    if (multipartFile == null) {
      throw new IllegalArgumentException("cannot save null");
    }
    final String filename = multipartFile.getOriginalFilename();
    LOGGER.debug("save multipartFile " + filename);
    final ObjectId objectId = gridFsTemplate.store(
        multipartFile.getInputStream(),
        filename);
    LOGGER.debug("multipartFile saved: " + objectId);
    return objectId.toString();
  }

  public void delete(final String profilePictureId) {
    if (profilePictureId != null) {
      gridFsTemplate.delete(whereId(profilePictureId));
    }
  }

  private Query whereId(final String id) {
    return new Query(Criteria.where("_id").is(new ObjectId(id)));
  }
}
