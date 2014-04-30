function initForce(){
       force=d3.layout.force()
                  .nodes(dataset.nodes)
                  .links(dataset.edges)
                  .size([w,h])
                  .linkDistance(function(d){
                     return  distanceScale(d.times);
                  })
                  .gravity(0.05)
                  .charge([-150])
		              .on("tick", function() {         

                    nodes.attr("cx", function(d) { return d.x; })
                         .attr("cy", function(d) { return d.y; });
                                                   
                   edges.attr("x1", function(d) { return d.source.x; })
                         .attr("y1", function(d) { return d.source.y; })
                         .attr("x2", function(d) { return d.target.x; })
                         .attr("y2", function(d) { return d.target.y; });

                    text.text(function(d,i) {return d.node})			//if(size[i].length > 1) return d.node; 
                                                				//else  return null;   })
                             .attr("x", function(d) { return d.x; })
                             .attr("y", function(d) { return d.y; });
                    //force.stop();
              	});
      }

               
     function update(){
        svg.selectAll("text").remove();
        svg.selectAll("line").remove();
        svg.selectAll("circle").remove();
        
        edges=svg.selectAll("line").data(dataset.edges);
     
            edges.enter().append("line").attr("class","edge");
            
            edges.exit().remove();
            
            
        nodes = svg.selectAll("circle").data(dataset.nodes);
            
            nodes.enter()
                 .append("circle")
                 .attr("class","node")
                 .attr("fill",function(d){
                    if(d._expand!==null)
                        return "red";
                     else
                        return "orange";
                  })
                 .attr("r", function(d,i){
                     if(d._expand !== null){
                        return dirSizeScale(size[i].length);
                  }
                     else{
                        return staSizeScale(size[i].length);
                     }
                  })
                  .on("mouseover",function(d,i){
                        highLight(i,true);
                        var co=d3.mouse(this);
                        showDescription(d.node,co);
                  })
                  .on("mouseout",function(d,i){
                     clean();
                     highLight(i,false);
                  })
                  .on("dblclick", function(d){
                     d3.event.stopPropagation();
                     if(d._expand!==null){
                        var di;
                        for(di=0;di<directors.length;di++){
                           if(directors[di].name===d.node)
                              break;
                        }
                        if(d._expand===true){
                            deleteEdges(directors[di]);
                         }
                        else{
                            addEdges(directors[di]);
                         }
                        d._expand=!d._expand;
                        update();
                     }
                  })
                 .call(force.drag);
         
            nodes.exit().remove();
            
         text = svg.selectAll("text").data(dataset.nodes);
         
            text.enter().append("text")
                    .attr("text-anchor","middle")
                    .attr("class",function(d,i){
                      if(size[i].length===1){
                        return "text";
                      }
                      else
                        return "textHL";
                    })
                    .on("mouseover",function(d,i){

                        highLight(i,true);
                        var co=d3.mouse(this);
                        showDescription(d.node,co);
                     })
                     .on("mouseout",function(d,i){
                        clean();
                        highLight(i,false);
                     })
                     .on("dblclick", function(d){
                     d3.event.stopPropagation();
                     if(d._expand!==null){
                        var di;
                        for(di=0;di<directors.length;di++){
                           if(directors[di].name===d.node)
                              break;
                        }
                        if(d._expand===true){
                            deleteEdges(directors[di]);
                         }
                        else{
                            addEdges(directors[di]);
                         }
                        d._expand=!d._expand;
                        update();
                     }
                  });
            
            text.exit().remove();   
         
         force.start();
         
     }//end update   
     
     var _init=false;
     d3.select("svg").on("dblclick",function(){
        if(!_init){
            for(var i=0;i<directors.length;i++){
               deleteEdges(directors[i]);
            }
            _init=!_init;
         }
         else{
            for(var i=0;i<directors.length;i++){
               addEdges(directors[i]);
            }
            _init=!_init;
         }
         update();
     })