package ${{values.java_package_name| replace("/", ".")}};

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;


class CamundaAdapterApplicationTests {

	@Test
	void test() {
		assertEquals(1, 0+1);
	}

}
