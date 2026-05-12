package ${{values.java_package_name| replace("/", ".")}}.common.security;

public class SamplePreAuthorizeAuthority {
    private SamplePreAuthorizeAuthority() {
    }

    public static final String MY_AUTHORITY="hasAnyAuthority('my-workflow-authz')";
    
}
