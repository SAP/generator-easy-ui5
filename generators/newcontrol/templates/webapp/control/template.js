sap.ui.define(
  ["<%= supercontrol.replace(/\./g, '/') %>"],
  function(Control) {
    return Control.extend("<%=appId%>.control.<%=controlname%>",{
         metadata: {
              properties: {},
              aggregations: {},
         },

         renderer: {},

         <% if (supercontrol !== 'sap.ui.core.Control') { %>
         onAfterRendering: function() {
              if(<%=supercontrol%>.prototype.onAfterRendering) {
                   <%=supercontrol%>.prototype.onAfterRendering.apply(this,arguments); //run the super class's method first
              }

              alert('<%=controlname%> has been rendered!');
         },
         <% } %>
    });
  }
);
