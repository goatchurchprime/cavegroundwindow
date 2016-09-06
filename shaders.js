shaders = { "X":"",
	"fragment_shader_passage":"	uniform float redalt; 	uniform float vfac; 	uniform vec4 closecolour; 	uniform float closedist; 	varying vec4 vflat4; 	varying float altitude; 	float midlump(float v, float offset) 	{	    float lv = (mod(v*vfac + offset, 1.0) - 0.5)/0.5; 	    return clamp(1.0 - lv*lv, 0.0, 1.0); 	}	void main(void) 	{	    gl_FragColor = vec4(midlump(altitude, redalt), midlump(altitude, redalt-0.667)*0.98, midlump(altitude, redalt-0.333), 1.0); 	    float fdepth = gl_FragCoord.z / gl_FragCoord.w; 	    float cfac = clamp((closedist - fdepth)*0.1, 0.0, 0.81); 	    float flatfac = max(0.0, max(max(abs(vflat4.x), abs(vflat4.y)), max(abs(vflat4.z), abs(vflat4.w))) - 510.0); 	    gl_FragColor = mix(gl_FragColor, closecolour, cfac); 	    gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0), flatfac); 	}	  ",
	"vertex_shader_passage":"	varying float altitude; 	varying vec4 vflat4; 	attribute vec4 flat4; 	void main()	{	    altitude = position.y; 	    vflat4 = flat4; 	    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);	    gl_Position = projectionMatrix * mvPosition; 	}	  ",
	"fragment_shader_centreline":"	uniform vec4 closecolour; 	uniform float closedist; 	uniform float selectedvsvxcaveindex; 	uniform float yeartime; 	uniform float redalt; 	uniform float vfac; 	varying float altitude; 	varying float vcosslope; 	varying float vsvxcaveindex; 	varying float vsvxyearvalue; 	float midlump(float v, float offset) 	{	    float lv = (mod(v*vfac + offset, 1.0) - 0.5)/0.5; 	    return clamp(1.0 - lv*lv, 0.0, 1.0); 	}	void main(void) 	{	    const float yearwhite = 180.0/365.0; 			    vec4 ptcolour = vec4(midlump(altitude, redalt), midlump(altitude, redalt-0.667)*0.98, midlump(altitude, redalt-0.333), 1.0); 	    vec4 sptcolour = mix(ptcolour, vec4(0.0, 0.0, 0.0, 1.0), 0.6*(1.0-vcosslope)); 	    float fdepth = gl_FragCoord.z / gl_FragCoord.w; 	    float cfac = clamp((closedist - fdepth)*0.1, 0.0, 0.81); 	    if (vsvxyearvalue > yeartime - yearwhite)	        cfac = 0.91; 	    if (vsvxcaveindex == selectedvsvxcaveindex)	        gl_FragColor = mix(sptcolour, vec4(0.0, 1.0, 1.0, 1.0), 0.8); 	    else	        gl_FragColor = mix(sptcolour, closecolour, cfac); 	}	  ",
	"vertex_shader_centreline":"	attribute float cosslope; 	attribute float svxcaveindex; 	attribute float svxyearvalue; 	varying float altitude; 	varying float vcosslope; 	varying float vsvxcaveindex; 	varying float vsvxyearvalue; 	void main()	{	    altitude = position.y; 	    vcosslope = cosslope; 	    vsvxcaveindex = svxcaveindex;  	    vsvxyearvalue = svxyearvalue; 	    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );	    gl_Position = projectionMatrix * mvPosition; 	}	  ",
	"fragment_shader_textlabel":"	uniform vec4 closecolour; 	uniform float closedist; 	uniform sampler2D texture;	varying vec2 vUv;	void main() 	{	    vec2 uv = vec2(vUv.x, vUv.y);	    vec3 color = texture2D(texture, uv).rgb;	    if (color.y == 0.0)	        discard; 	    vec4 sptcolour = vec4(color, 1.0);		    	    float fdepth = gl_FragCoord.z / gl_FragCoord.w; 	    float cfac = clamp((closedist - fdepth)*0.1, 0.0, 0.81); 	    gl_FragColor = mix(sptcolour, closecolour, (color.y >= 0.5 ? cfac : 0.0)); 	}	  ",
	"vertex_shader_textlabel":"	uniform float aspect; 	uniform float pixelsize; 	uniform float textureaspect; 	varying vec2 vUv;	void main()	{	    vUv = uv;	    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);	    gl_Position = projectionMatrix * mvPosition; 	    float spixelsize = pixelsize*gl_Position.z; 	    gl_Position.x += uv.x*spixelsize*textureaspect; 	    gl_Position.y += uv.y*spixelsize*aspect; 	}	  ",
	"vertex_shader_peaktriangle":"	uniform float trianglesize; 	uniform float aspect; 	attribute float pcorner; 	void main()	{		    vec4 position1 = vec4(position, 1.0); 	    vec4 mvPosition = modelViewMatrix * position1;	    gl_Position = projectionMatrix * mvPosition; 	    if (pcorner != 0.0) {	        position1.y += 1.0; 	        vec4 glposition1 = projectionMatrix * (modelViewMatrix * position1); 	        vec2 v = vec2(glposition1) - vec2(gl_Position);  	        float xv = v.x; 	        float yv = v.y; 	        float strianglesize = trianglesize*gl_Position.z; 	        float d = length(v); 	        float dfac = (d > 0.000001 ? 1.0/d : 1.0)*strianglesize; 	        float dsfac = dfac*0.57735*(pcorner == 1.0 ? 1.0 : -1.0); 	        gl_Position.x += (-v.x*dfac + v.y*dsfac); 	        gl_Position.y += (-v.y*dfac - v.x*dsfac)*aspect; 	        	        	        	        	    }	}	  ",
	"vertex_shader_enttriangle":"	uniform float trianglesize; 	uniform float aspect; 	attribute float pcorner; 	attribute float svxcaveindex; 	varying float altitude; 	varying float vcosslope; 	varying float vsvxcaveindex; 	varying float vsvxyearvalue; 	void main()	{	    altitude = position.y; 	    vcosslope = 1.0; 	    vsvxcaveindex = svxcaveindex; 	    vsvxyearvalue = 9999.0; 	    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);	    gl_Position = projectionMatrix * mvPosition; 	    float strianglesize = trianglesize*gl_Position.z*10.0; 	    if (pcorner != 0.0) {	        gl_Position.y += strianglesize*aspect; 	        gl_Position.x += (pcorner == 1.0 ? 1.0 : -1.0) * 0.57735*strianglesize*0.5; 	    }	}	  "
}
