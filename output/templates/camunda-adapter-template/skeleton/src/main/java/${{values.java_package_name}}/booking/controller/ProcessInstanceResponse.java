package ${{values.java_package_name| replace("/", ".")}}.booking.controller;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode
@NoArgsConstructor
public class ProcessInstanceResponse {

    private Long processDefinitionKey;
    private String bpmnProcessId;
    private Integer processVersion;

    private Long processInstanceKey;

}
