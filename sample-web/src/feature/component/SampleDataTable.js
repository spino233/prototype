import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const SampleDataTable = (props) => {
    const columnStyle = {minWidth: '100px'};
    return (
      <div>
         <DataTable value={props.items} scrollable scrollHeight='flex' style={props.tableStyle} dataKey="id">
                  {
                  props.items.length > 0 ? 
                    Object.keys(props.items[0]).map((prop) => (
                      (
                        <Column 
                          field={prop} 
                          header={prop.charAt(0).toUpperCase() + prop.slice(1)} 
                          sortable 
                          columnKey={columnStyle}>
                        </Column>
                      )
                  )) : ""
                } 
        </DataTable>
      </div>
    )       
}

export default SampleDataTable;