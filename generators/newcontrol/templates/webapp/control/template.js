sap.ui.define(
  ['<%= supercontrol.replace(/\./g, '/') %>'],
  function(Control) {
	  return Control.extend("<%=namespace%>.<%=projectname%>.control.<%=controlname%>",{
	       metadata: {
	            properties: {},
	            aggregations: {},
	       },

	       renderer: {},

	       onAfterRendering: function() {
	            if(<%=supercontrol%>.prototype.onAfterRendering) {
	                 <%=supercontrol%>.prototype.onAfterRendering.apply(this,arguments); //run the super class's method first
	            }

							alert('<%=controlname%> has been rendered!');
	       },
	  });
  }
);
