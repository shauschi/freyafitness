package freya.fitness.repository.mongodb;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;
import freya.fitness.utils.Size;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

@Repository
public class ProfilePictureRepository {

  private final Logger LOGGER = LogManager.getLogger(ProfilePictureRepository.class);

  @Autowired
  private GridFsTemplate gridFsTemplate;

  public byte[] getByUserIdAndSize(final UUID userId, final Size size) throws IOException {
    LOGGER.debug("get profile picture by user id " + userId + " (" + size + ")");
    if (userId == null) {
      return null;
    }

    final GridFSFile result = gridFsTemplate.findOne(whereUserAndSize(userId, size));
    if (result == null) {
      final String message = "no profile picture available for " + userId + " (" + size + ")";
      LOGGER.debug(message);
      return null;
    }

    final String filename = result.getFilename();
    final GridFsResource resource = gridFsTemplate.getResource(filename);
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    try (final InputStream is = resource.getInputStream()){
      int nRead;
      byte[] data = new byte[1024];
      while ((nRead = is.read(data, 0, data.length)) != -1) {
        buffer.write(data, 0, nRead);
      }
      buffer.flush();
      byte[] byteArray = buffer.toByteArray();

      LOGGER.debug(byteArray.length + " bytes read");
      return byteArray;
    }

  }

  public void save(final MultipartFile multipartFile, final UUID userId) throws IOException {
    if (multipartFile == null) {
      throw new IllegalArgumentException("cannot save null");
    }
    final String filename = multipartFile.getOriginalFilename();
    LOGGER.debug("save multipartFile " + filename);

    final InputStream is = multipartFile.getInputStream();
    final BufferedImage image = ImageIO.read(is);
    for (Size size : Size.values()) {
      final BufferedImage resizedImage = getResizedImage(image, size);
      final InputStream resizedInputStream = getImageAsInputStream(resizedImage);
      save(resizedInputStream, userId, size, filename);
    }
  }

  private InputStream getImageAsInputStream(final BufferedImage image) throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    ImageIO.write(image,"png", os);
    return new ByteArrayInputStream(os.toByteArray());
  }

  private BufferedImage getResizedImage(BufferedImage original, Size targetSize) {
    if (Size.ORIGINAL == targetSize) {
      return original;
    }
    int preferredSize = targetSize.getPreferredSize();
    return createResizedCopy(original, preferredSize, preferredSize);
  }

  private BufferedImage createResizedCopy(final Image originalImage, int scaledWidth, int scaledHeight) {
    final Image tmp = originalImage.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);
    final BufferedImage resized = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
    final Graphics2D g = resized.createGraphics();
    g.setComposite(AlphaComposite.Src);
    g.drawImage(tmp, 0, 0, scaledWidth, scaledHeight, null);
    g.dispose();
    return resized;
  }

  private void save(final InputStream inputStream, final UUID userId, final Size size, final String filename) {
    final DBObject metadata = new BasicDBObject();
    metadata.put("userId", userId);
    metadata.put("size", size);

    final ObjectId objectId = gridFsTemplate.store(
        inputStream,
        filename +  "_" + size,
        metadata);
    LOGGER.debug("file saved for userId {} ({} ,{}) with id {}", userId, size, filename, objectId);
  }

  public void delete(final UUID userId) {
    if (userId != null) {
      gridFsTemplate.delete(whereUser(userId));
    }
  }

  private Query whereId(final String id) {
    return new Query(Criteria.where("_id").is(new ObjectId(id)));
  }

  private Query whereUser(final UUID userId) {
    return new Query(Criteria
        .where("metadata.userId").is(userId)
    );
  }

  private Query whereUserAndSize(final UUID userId, final Size size) {
    return new Query(Criteria
        .where("metadata.userId").is(userId)
        .and("metadata.size").is(size)
    );
  }


}
