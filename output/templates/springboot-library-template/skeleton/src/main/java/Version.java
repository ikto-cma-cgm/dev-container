package ${{ values.packageName | replace(".", "/") }};

public final class Version {

    private Version() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static final String VERSION = "${project.version}";

    /**
     * Returns the current library version.
     *
     * @return version string
     */
    public static String getVersion() {
        return VERSION;
    }
}
