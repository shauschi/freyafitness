package freya.fitness.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSFindIterable;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.gridfs.GridFSDBFile;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.UserRepository;
import freya.fitness.repository.mongodb.ProfilePictureRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.*;

@Service
public class ProfilePictureService {

  @Autowired
  private GridFsTemplate gridFsTemplate;

  @Autowired
  private ProfilePictureRepository profilePictureRepository;

  @Autowired
  private UserRepository userRepository;

  public byte[] getProfilePicture(final String profilePictureId) throws IOException {
    GridFSFile result =
        gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(profilePictureId))));

    GridFSFindIterable it = gridFsTemplate.find(null);
    GridFsResource[] res = gridFsTemplate.getResources("*");

    GridFsResource resource = gridFsTemplate.getResource(result.getFilename());

    InputStream is = resource.getInputStream();
    byte[] buffer = new byte[(int) resource.contentLength()];
    is.read(buffer);
    return buffer;

//    File target = new File(resource.getFilename());
//    OutputStream os = new FileOutputStream(target);
//    os.write(buffer);
//
//    return target;

//    return profilePictureRepository.findById(profilePictureId)
//        .map(ProfilePicture::getImage)
//        .orElse(null);
  }

  @Transactional
  public void changeProfilePicture(final Long userId, final MultipartFile multipartFile)
      throws IOException {
    final User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);

    final String pictureId = gridFsTemplate.store(
        multipartFile.getInputStream(),
        multipartFile.getOriginalFilename())
        .toString();

//    final ProfilePicture savedProfilePicture =
//        profilePictureRepository.save(new ProfilePicture(image));

    user.setProfilePictureId(pictureId);
    userRepository.save(user);
  }
}
