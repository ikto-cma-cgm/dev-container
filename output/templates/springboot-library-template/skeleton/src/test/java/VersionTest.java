package ${{ values.packageName | replace(".", "/") }};

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class VersionTest {

    @Test
    void getVersion_shouldReturnValidVersion() {
        String version = Version.getVersion();
        assertNotNull(version);
        assertFalse(version.isEmpty());
    }
}
