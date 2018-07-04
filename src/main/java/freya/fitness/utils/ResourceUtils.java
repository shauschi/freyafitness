package freya.fitness.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class ResourceUtils {

  private static final Logger LOGGER = LogManager.getLogger(ResourceUtils.class);

  public static String getResourceAsString(final String filename) throws ResourceLoadingException {
    try {
      final File file = getResourceAsFile(filename);
      final InputStream in = new FileInputStream(file);
      byte[] bytes = new byte[(int) file.length()];
      int result = in.read(bytes);
      if (-1 == result) {
        throw new ResourceLoadingException(filename);
      }
      return new String(bytes);
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }


  public static File getResourceAsFile(final String filename) throws ResourceLoadingException {
    try {
      return org.springframework.util.ResourceUtils.getFile("classpath:" + filename);
    } catch (final IOException cause) {
      LOGGER.error("Could not read file {}", filename, cause);
      throw new ResourceLoadingException(filename, cause);
    }
  }
}
