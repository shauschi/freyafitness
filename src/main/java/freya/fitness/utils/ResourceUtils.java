package freya.fitness.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ResourceUtils {

  private static final Logger LOGGER = LogManager.getLogger(ResourceUtils.class);

  public static String getResourceAsString(final String filename) throws ResourceLoadingException {
    try {
      final URL resource = Thread.currentThread().getContextClassLoader().getResource(filename);
      if (null == resource) {
        throw new ResourceLoadingException(filename);
      }
      final URI uri = resource.toURI();
      final Path path = Paths.get(uri);
      byte[] bytes = Files.readAllBytes(path);
      return new String(bytes);
    } catch (final IOException | URISyntaxException cause) {
      LOGGER.error("Could not read file {}", filename);
      throw new ResourceLoadingException(filename, cause);
    }
  }


  public static File getResourceAsFile(final String filename) throws ResourceLoadingException {
    try {
      final URL resource = Thread.currentThread().getContextClassLoader().getResource(filename);
      if (null == resource) {
        throw new ResourceLoadingException(filename);
      }
      final URI uri = resource.toURI();
      return new File(uri);
    } catch (final URISyntaxException cause) {
      LOGGER.error("Could not read file {}", filename);
      throw new ResourceLoadingException(filename, cause);
    }
  }
}
