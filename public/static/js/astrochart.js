/*! astrochart v2.3.1 */
(!(function (t) {
  ((t.SYMBOL_SCALE = 1),
    (t.COLOR_BACKGROUND = '#00000000'),
    (t.POINTS_COLOR = '#D4C9FF'),
    (t.POINTS_TEXT_SIZE = 8),
    (t.POINTS_STROKE = 1),
    (t.SIGNS_COLOR = '#161548'),
    (t.SIGNS_STROKE = 1),
    (t.MARGIN = 20),
    (t.PADDING = 8),
    (t.ID_CHART = 'aistro'),
    (t.ID_RADIX = 'radix'),
    (t.ID_TRANSIT = 'transit'),
    (t.ID_ASPECTS = 'aspects'),
    (t.ID_POINTS = 'planets'),
    (t.ID_SIGNS = 'signs'),
    (t.ID_CIRCLES = 'circles'),
    (t.ID_AXIS = 'axis'),
    (t.ID_CUSPS = 'cusps'),
    (t.ID_RULER = 'ruler'),
    (t.ID_BG = 'bg'),
    (t.CIRCLE_COLOR = '#D4C9FF'),
    (t.CIRCLE_STRONG = 1),
    (t.LINE_COLOR = '#D4C9FF'),
    (t.INDOOR_CIRCLE_RADIUS_RATIO = 1.8),
    (t.INNER_CIRCLE_RADIUS_RATIO = 8),
    (t.RULER_RADIUS = 4),
    (t.SYMBOL_SUN = 'Sun'),
    (t.SYMBOL_MOON = 'Moon'),
    (t.SYMBOL_MERCURY = 'Mercury'),
    (t.SYMBOL_VENUS = 'Venus'),
    (t.SYMBOL_MARS = 'Mars'),
    (t.SYMBOL_JUPITER = 'Jupiter'),
    (t.SYMBOL_SATURN = 'Saturn'),
    (t.SYMBOL_URANUS = 'Uranus'),
    (t.SYMBOL_NEPTUNE = 'Neptune'),
    (t.SYMBOL_PLUTO = 'Pluto'),
    (t.SYMBOL_CHIRON = 'Chiron'),
    (t.SYMBOL_LILITH = 'Lilith'),
    (t.SYMBOL_NNODE = 'NNode'),
    (t.SYMBOL_ASCENDANT = 'Ascendant'),
    (t.SYMBOL_AS = 'As'),
    (t.SYMBOL_DS = 'Ds'),
    (t.SYMBOL_MC = 'Mc'),
    (t.SYMBOL_IC = 'Ic'),
    (t.SYMBOL_AXIS_FONT_COLOR = '#00000000'),
    (t.SYMBOL_AXIS_STROKE = 1),
    (t.SYMBOL_CUSP_1 = '1'),
    (t.SYMBOL_CUSP_2 = '2'),
    (t.SYMBOL_CUSP_3 = '3'),
    (t.SYMBOL_CUSP_4 = '4'),
    (t.SYMBOL_CUSP_5 = '5'),
    (t.SYMBOL_CUSP_6 = '6'),
    (t.SYMBOL_CUSP_7 = '7'),
    (t.SYMBOL_CUSP_8 = '8'),
    (t.SYMBOL_CUSP_9 = '9'),
    (t.SYMBOL_CUSP_10 = '10'),
    (t.SYMBOL_CUSP_11 = '11'),
    (t.SYMBOL_CUSP_12 = '12'),
    (t.CUSPS_STROKE = 1),
    (t.CUSPS_FONT_COLOR = '#D4C9FF'),
    (t.SYMBOL_ARIES = 'Aries'),
    (t.SYMBOL_TAURUS = 'Taurus'),
    (t.SYMBOL_GEMINI = 'Gemini'),
    (t.SYMBOL_CANCER = 'Cancer'),
    (t.SYMBOL_LEO = 'Leo'),
    (t.SYMBOL_VIRGO = 'Virgo'),
    (t.SYMBOL_LIBRA = 'Libra'),
    (t.SYMBOL_SCORPIO = 'Scorpio'),
    (t.SYMBOL_SAGITTARIUS = 'Sagittarius'),
    (t.SYMBOL_CAPRICORN = 'Capricorn'),
    (t.SYMBOL_AQUARIUS = 'Aquarius'),
    (t.SYMBOL_PISCES = 'Pisces'),
    (t.SYMBOL_SIGNS = [
      t.SYMBOL_ARIES,
      t.SYMBOL_TAURUS,
      t.SYMBOL_GEMINI,
      t.SYMBOL_CANCER,
      t.SYMBOL_LEO,
      t.SYMBOL_VIRGO,
      t.SYMBOL_LIBRA,
      t.SYMBOL_SCORPIO,
      t.SYMBOL_SAGITTARIUS,
      t.SYMBOL_CAPRICORN,
      t.SYMBOL_AQUARIUS,
      t.SYMBOL_PISCES,
    ]),
    (t.COLOR_ARIES = '#D4C9FF'),
    (t.COLOR_TAURUS = '#D4C9FF'),
    (t.COLOR_GEMINI = '#D4C9FF'),
    (t.COLOR_CANCER = '#D4C9FF'),
    (t.COLOR_LEO = '#D4C9FF'),
    (t.COLOR_VIRGO = '#D4C9FF'),
    (t.COLOR_LIBRA = '#D4C9FF'),
    (t.COLOR_SCORPIO = '#D4C9FF'),
    (t.COLOR_SAGITTARIUS = '#D4C9FF'),
    (t.COLOR_CAPRICORN = '#D4C9FF'),
    (t.COLOR_AQUARIUS = '#D4C9FF'),
    (t.COLOR_PISCES = '#D4C9FF'),
    (t.COLORS_SIGNS = [
      t.COLOR_ARIES,
      t.COLOR_TAURUS,
      t.COLOR_GEMINI,
      t.COLOR_CANCER,
      t.COLOR_LEO,
      t.COLOR_VIRGO,
      t.COLOR_LIBRA,
      t.COLOR_SCORPIO,
      t.COLOR_SAGITTARIUS,
      t.COLOR_CAPRICORN,
      t.COLOR_AQUARIUS,
      t.COLOR_PISCES,
    ]),
    (t.CUSTOM_SYMBOL_FN = null),
    (t.SHIFT_IN_DEGREES = 180),
    (t.STROKE_ONLY = !1),
    (t.ADD_CLICK_AREA = !1),
    (t.COLLISION_RADIUS = 10),
    (t.ASPECTS = {
      conjunction: { degree: 0, orbit: 10, color: 'transparent' },
      square: { degree: 90, orbit: 8, color: '#D4C9FF' },
      trine: { degree: 120, orbit: 8, color: '#D4C9FF' },
      opposition: { degree: 180, orbit: 10, color: '#D4C9FF' },
    }),
    (t.DIGNITIES_RULERSHIP = 'r'),
    (t.DIGNITIES_DETRIMENT = 'd'),
    (t.DIGNITIES_EXALTATION = 'e'),
    (t.DIGNITIES_EXACT_EXALTATION = 'E'),
    (t.DIGNITIES_FALL = 'f'),
    (t.DIGNITIES_EXACT_EXALTATION_DEFAULT = [
      { name: 'Sun', position: 19, orbit: 2 },
      { name: 'Moon', position: 33, orbit: 2 },
      { name: 'Mercury', position: 155, orbit: 2 },
      { name: 'Venus', position: 357, orbit: 2 },
      { name: 'Mars', position: 298, orbit: 2 },
      { name: 'Jupiter', position: 105, orbit: 2 },
      { name: 'Saturn', position: 201, orbit: 2 },
      { name: 'NNode', position: 63, orbit: 2 },
    ]),
    (t.ANIMATION_CUSPS_ROTATION_SPEED = 2),
    (t.DEBUG = !1));
})((window.astrology = window.astrology || {})),
  (function (gt) {
    var ft;
    function yt(t, e) {
      var s = document.createElementNS(ft.root.namespaceURI, 'rect');
      return (
        s.setAttribute('x', t - gt.SIGNS_STROKE),
        s.setAttribute('y', e - gt.SIGNS_STROKE),
        s.setAttribute('width', '20px'),
        s.setAttribute('height', '20px'),
        s.setAttribute('fill', 'transparent'),
        s
      );
    }
    function wt(t) {
      return gt._paperElementId + '-' + gt.ID_RADIX + '-' + gt.ID_SIGNS + '-' + t;
    }
    function kt(t) {
      return gt._paperElementId + '-' + gt.ID_RADIX + '-' + gt.ID_CUSPS + '-' + t;
    }
    function xt(t, e) {
      ((t = Math.round(t + 19 * gt.SYMBOL_SCALE)), (e = Math.round(e + 2 * gt.SYMBOL_SCALE)));
      var s = document.createElementNS(ft.root.namespaceURI, 'g'),
        i =
          (s.setAttribute(
            'transform',
            'translate(' +
              -t * (gt.SYMBOL_SCALE - 1) +
              ',' +
              -e * (gt.SYMBOL_SCALE - 1) +
              ') scale(' +
              gt.SYMBOL_SCALE +
              ')',
          ),
          document.createElementNS(ft.root.namespaceURI, 'path'));
      return (
        i.setAttribute(
          'd',
          'm ' +
            t +
            ', ' +
            e +
            ' -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401',
        ),
        i.setAttribute('stroke', gt.SYMBOL_AXIS_FONT_COLOR),
        i.setAttribute('stroke-width', gt.SYMBOL_AXIS_STROKE * gt.SYMBOL_SCALE),
        i.setAttribute('fill', 'none'),
        s
      );
    }
    ((gt.SVG = function (t, e, s) {
      var i = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        t =
          (i.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink'),
          i.setAttribute('style', 'position: relative; overflow: hidden;'),
          i.setAttribute('version', '1.1'),
          i.setAttribute('width', e),
          i.setAttribute('height', s),
          i.setAttribute('viewBox', '0 0 ' + e + ' ' + s),
          document.getElementById(t).appendChild(i),
          (gt._paperElementId = t + '-' + gt.ID_CHART),
          document.createElementNS(i.namespaceURI, 'g'));
      (t.setAttribute('id', gt._paperElementId),
        i.appendChild(t),
        (this.DOMElement = i),
        (this.root = t),
        (this.width = e),
        (this.height = s),
        (ft = this));
    }),
      (gt.SVG.prototype._getSymbol = function (w, t, e) {
        switch (w) {
          case gt.SYMBOL_SUN:
            return (
              (Tt = t),
              (Pt = e),
              (Tt = Math.round(Tt + -1 * gt.SYMBOL_SCALE)),
              (Pt = Math.round(Pt + -8 * gt.SYMBOL_SCALE)),
              (Dt = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Tt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -Pt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Ut = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Tt +
                  ', ' +
                  Pt +
                  ' -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0',
              ),
              Ut.setAttribute('stroke', gt.POINTS_COLOR),
              Ut.setAttribute('stroke-width', gt.POINTS_STROKE),
              Ut.setAttribute('fill', 'none'),
              Dt.appendChild(Ut),
              Dt
            );
          case gt.SYMBOL_MOON:
            return (
              (Tt = t),
              (Pt = e),
              (Tt = Math.round(Tt + -2 * gt.SYMBOL_SCALE)),
              (Pt = Math.round(Pt + -7 * gt.SYMBOL_SCALE)),
              (Ut = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Tt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -Pt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Dt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Tt +
                  ', ' +
                  Pt +
                  ' a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z',
              ),
              Dt.setAttribute('stroke', gt.POINTS_COLOR),
              Dt.setAttribute('stroke-width', gt.POINTS_STROKE),
              Dt.setAttribute('fill', 'none'),
              Ut.appendChild(Dt),
              Ut
            );
          case gt.SYMBOL_MERCURY:
            return (
              (Bt = t),
              (Yt = e),
              (Bt = Math.round(Bt + -2 * gt.SYMBOL_SCALE)),
              (Yt = Math.round(Yt + 7 * gt.SYMBOL_SCALE)),
              (bt = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Bt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -Yt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (y = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Bt +
                  ', ' +
                  Yt +
                  ' 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z',
              ),
              y.setAttribute('stroke', gt.POINTS_COLOR),
              y.setAttribute('stroke-width', gt.POINTS_STROKE),
              y.setAttribute('fill', 'none'),
              bt.appendChild(y),
              (y = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (Bt + 6) +
                  ', ' +
                  (Yt + -16) +
                  ' a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445',
              ),
              y.setAttribute('stroke', gt.POINTS_COLOR),
              y.setAttribute('stroke-width', gt.POINTS_STROKE),
              y.setAttribute('fill', 'none'),
              bt.appendChild(y),
              bt
            );
          case gt.SYMBOL_VENUS:
            return (
              (Bt = t),
              (Yt = e),
              (Bt = Math.round(Bt + 2 * gt.SYMBOL_SCALE)),
              (Yt = Math.round(Yt + 7 * gt.SYMBOL_SCALE)),
              (y = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Bt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -Yt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (bt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Bt +
                  ', ' +
                  Yt +
                  ' -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208',
              ),
              bt.setAttribute('stroke', gt.POINTS_COLOR),
              bt.setAttribute('stroke-width', gt.POINTS_STROKE),
              bt.setAttribute('fill', 'none'),
              y.appendChild(bt),
              y
            );
          case gt.SYMBOL_MARS:
            return (
              (mt = t),
              (Rt = e),
              (mt = Math.round(mt + 2 * gt.SYMBOL_SCALE)),
              (Rt = Math.round(Rt + -2 * gt.SYMBOL_SCALE)),
              (Mt = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -mt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -Rt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Nt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  mt +
                  ', ' +
                  Rt +
                  ' c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507',
              ),
              Nt.setAttribute('stroke', gt.POINTS_COLOR),
              Nt.setAttribute('stroke-width', gt.POINTS_STROKE),
              Nt.setAttribute('fill', 'none'),
              Mt.appendChild(Nt),
              Mt
            );
          case gt.SYMBOL_JUPITER:
            ((mt = t),
              (Rt = e),
              (Nt =
                ((mt = Math.round(mt + -5 * gt.SYMBOL_SCALE)),
                (Rt = Math.round(Rt + -2 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (Mt =
                (Nt.setAttribute(
                  'transform',
                  'translate(' +
                    -mt * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -Rt * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              Mt.setAttribute(
                'd',
                'm' +
                  mt +
                  ', ' +
                  Rt +
                  ' c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279',
              ),
              Mt.setAttribute('stroke', gt.POINTS_COLOR),
              Mt.setAttribute('stroke-width', gt.POINTS_STROKE),
              Mt.setAttribute('fill', 'none'),
              Nt.appendChild(Mt),
              gt.ADD_CLICK_AREA && Nt.appendChild(yt(mt, Rt - 3)),
              Nt
            );
          case gt.SYMBOL_SATURN:
            return (
              (U = t),
              (g = e),
              (U = Math.round(U + 5 * gt.SYMBOL_SCALE)),
              (g = Math.round(g + 10 * gt.SYMBOL_SCALE)),
              (f = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -U * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -g * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Et = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  U +
                  ', ' +
                  g +
                  ' c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438',
              ),
              Et.setAttribute('stroke', gt.POINTS_COLOR),
              Et.setAttribute('stroke-width', gt.POINTS_STROKE),
              Et.setAttribute('fill', 'none'),
              f.appendChild(Et),
              f
            );
          case gt.SYMBOL_URANUS:
            ((U = t),
              (g = e),
              (Et =
                ((U = Math.round(U + -5 * gt.SYMBOL_SCALE)),
                (g = Math.round(g + -7 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (f =
                (Et.setAttribute(
                  'transform',
                  'translate(' +
                    -U * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -g * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              f.setAttribute(
                'd',
                'm' +
                  U +
                  ', ' +
                  g +
                  '  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985',
              ),
              f.setAttribute('stroke', gt.POINTS_COLOR),
              f.setAttribute('stroke-width', gt.POINTS_STROKE),
              f.setAttribute('fill', 'none'),
              Et.appendChild(f),
              (f = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (U + 7) +
                  ', ' +
                  (g + 14.5) +
                  ' a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z',
              ),
              f.setAttribute('stroke', gt.POINTS_COLOR),
              f.setAttribute('stroke-width', gt.POINTS_STROKE),
              f.setAttribute('fill', 'none'),
              Et.appendChild(f),
              gt.ADD_CLICK_AREA && Et.appendChild(yt(U, g)),
              Et
            );
          case gt.SYMBOL_NEPTUNE:
            return (
              (Ct = t),
              (It = e),
              (Ct = Math.round(Ct + 3 * gt.SYMBOL_SCALE)),
              (It = Math.round(It + -5 * gt.SYMBOL_SCALE)),
              (D = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Ct * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -It * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (ct = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Ct +
                  ', ' +
                  It +
                  ' 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803',
              ),
              ct.setAttribute('stroke', gt.POINTS_COLOR),
              ct.setAttribute('stroke-width', gt.POINTS_STROKE),
              ct.setAttribute('fill', 'none'),
              D.appendChild(ct),
              D
            );
          case gt.SYMBOL_PLUTO:
            return (
              (Ct = t),
              (It = e),
              (Ct = Math.round(Ct + 5 * gt.SYMBOL_SCALE)),
              (It = Math.round(It + -5 * gt.SYMBOL_SCALE)),
              (ct = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -Ct * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -It * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (D = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  Ct +
                  ', ' +
                  It +
                  ' a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0',
              ),
              D.setAttribute('stroke', gt.POINTS_COLOR),
              D.setAttribute('stroke-width', gt.POINTS_STROKE),
              D.setAttribute('fill', 'none'),
              ct.appendChild(D),
              (D = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (Ct + -2.3) +
                  ', ' +
                  (It + 0) +
                  ' a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z',
              ),
              D.setAttribute('stroke', gt.POINTS_COLOR),
              D.setAttribute('stroke-width', gt.POINTS_STROKE),
              D.setAttribute('fill', 'none'),
              ct.appendChild(D),
              ct
            );
          case gt.SYMBOL_CHIRON:
            return (
              (pt = t),
              (dt = e),
              (pt = Math.round(pt + 3 * gt.SYMBOL_SCALE)),
              (dt = Math.round(dt + 5 * gt.SYMBOL_SCALE)),
              (lt = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -pt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -dt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (P = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  pt +
                  ', ' +
                  dt +
                  ' a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z',
              ),
              P.setAttribute('stroke', gt.POINTS_COLOR),
              P.setAttribute('stroke-width', gt.POINTS_STROKE),
              P.setAttribute('fill', 'none'),
              lt.appendChild(P),
              (P = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (pt + 0) +
                  ', ' +
                  (dt + -13) +
                  '   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251',
              ),
              P.setAttribute('stroke', gt.POINTS_COLOR),
              P.setAttribute('stroke-width', gt.POINTS_STROKE),
              P.setAttribute('fill', 'none'),
              lt.appendChild(P),
              lt
            );
          case gt.SYMBOL_LILITH:
            return (
              (pt = t),
              (dt = e),
              (pt = Math.round(pt + 2 * gt.SYMBOL_SCALE)),
              (dt = Math.round(dt + 4 * gt.SYMBOL_SCALE)),
              (P = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -pt * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -dt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (lt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  pt +
                  ', ' +
                  dt +
                  ' -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0',
              ),
              lt.setAttribute('stroke', gt.POINTS_COLOR),
              lt.setAttribute('stroke-width', gt.POINTS_STROKE),
              lt.setAttribute('fill', 'none'),
              P.appendChild(lt),
              P
            );
          case gt.SYMBOL_NNODE:
            return (
              (At = t),
              (_t = e),
              (At = Math.round(At + -2 * gt.SYMBOL_SCALE)),
              (_t = Math.round(_t + 3 * gt.SYMBOL_SCALE)),
              (ht = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -At * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -_t * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Ot = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  At +
                  ', ' +
                  _t +
                  ' -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333',
              ),
              Ot.setAttribute('stroke', gt.POINTS_COLOR),
              Ot.setAttribute('stroke-width', gt.POINTS_STROKE),
              Ot.setAttribute('fill', 'none'),
              ht.appendChild(Ot),
              ht
            );
          case gt.SYMBOL_ARIES:
            ((At = t),
              (_t = e),
              (Ot =
                ((At = Math.round(At + -9 * gt.SYMBOL_SCALE)),
                (_t = Math.round(_t + -2 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (ht =
                (Ot.setAttribute('id', wt(gt.SYMBOL_ARIES)),
                Ot.setAttribute(
                  'transform',
                  'translate(' +
                    -At * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -_t * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              ht.setAttribute(
                'd',
                'm ' +
                  At +
                  ', ' +
                  _t +
                  ' -0.9,-0.9 0,-1.8 0.9,-1.8 1.8,-0.8999998 1.8,0 1.8,0.8999998 0.9,0.9 0.9,1.8 0.9,4.5 m -9,-5.4 1.8,-1.8 1.8,0 1.8,0.9 0.9,0.9 0.9,1.8 0.9,3.6 0,9.9 m 8.1,-12.6 0.9,-0.9 0,-1.8 -0.9,-1.8 -1.8,-0.8999998 -1.8,0 -1.8,0.8999998 -0.9,0.9 -0.9,1.8 -0.9,4.5 m 9,-5.4 -1.8,-1.8 -1.8,0 -1.8,0.9 -0.9,0.9 -0.9,1.8 -0.9,3.6 0,9.9',
              ),
              ht.setAttribute('stroke', gt.SIGNS_COLOR),
              ht.setAttribute('stroke-width', gt.SIGNS_STROKE),
              ht.setAttribute('fill', 'none'),
              Ot.appendChild(ht),
              gt.ADD_CLICK_AREA && Ot.appendChild(yt(At, _t - 4)),
              Ot
            );
          case gt.SYMBOL_TAURUS:
            var s = t,
              i = e,
              r =
                ((s = Math.round(s + -9 * gt.SYMBOL_SCALE)),
                (i = Math.round(i + -11 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              a =
                (r.setAttribute('id', wt(gt.SYMBOL_TAURUS)),
                r.setAttribute(
                  'transform',
                  'translate(' +
                    -s * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -i * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              a.setAttribute(
                'd',
                'm ' +
                  s +
                  ', ' +
                  i +
                  ' 1,4 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-4 m -18,0 1,3 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-3 m -11,8 -2,1 -1,1 -1,2 0,3 1,2 2,2 2,1 2,0 2,-1 2,-2 1,-2 0,-3 -1,-2 -1,-1 -2,-1 m -4,1 -2,1 -1,2 0,3 1,3 m 8,0 1,-3 0,-3 -1,-2 -2,-1',
              ),
              a.setAttribute('stroke', gt.SIGNS_COLOR),
              a.setAttribute('stroke-width', gt.SIGNS_STROKE),
              a.setAttribute('fill', 'none'),
              r.appendChild(a),
              gt.ADD_CLICK_AREA && r.appendChild(yt(s, i)),
              r
            );
          case gt.SYMBOL_GEMINI:
            ((a = t),
              (s = e),
              (i =
                ((a = Math.round(a + -6 * gt.SYMBOL_SCALE)),
                (s = Math.round(s + -6 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (r =
                (i.setAttribute('id', wt(gt.SYMBOL_GEMINI)),
                i.setAttribute(
                  'transform',
                  'translate(' +
                    -a * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -s * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              r.setAttribute(
                'd',
                'm ' +
                  a +
                  ', ' +
                  s +
                  ' 0,11.546414 m 0.9622011,-10.5842129 0,9.6220117 m 7.6976097,-9.6220117 0,9.6220117 m 0.962201,-10.5842128 0,11.546414 m -13.4708165,-14.4330172 1.9244023,1.924402 1.9244024,0.9622012 2.8866038,0.9622011 3.848804,0 2.886604,-0.9622011 1.924402,-0.9622012 1.924403,-1.924402 m -17.3196215,17.3196207 1.9244023,-1.9244024 1.9244024,-0.9622011 2.8866038,-0.9622012 3.848804,0 2.886604,0.9622012 1.924402,0.9622011 1.924403,1.9244024',
              ),
              r.setAttribute('stroke', gt.SIGNS_COLOR),
              r.setAttribute('stroke-width', gt.SIGNS_STROKE),
              r.setAttribute('fill', 'none'),
              i.appendChild(r),
              gt.ADD_CLICK_AREA && i.appendChild(yt(a, s)),
              i
            );
          case gt.SYMBOL_CANCER:
            var n = t,
              o = e,
              S =
                ((n = Math.round(n + 9 * gt.SYMBOL_SCALE)),
                (o = Math.round(o + -9 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              u =
                (S.setAttribute('id', wt(gt.SYMBOL_CANCER)),
                S.setAttribute(
                  'transform',
                  'translate(' +
                    -n * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -o * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              u.setAttribute(
                'd',
                'm ' +
                  n +
                  ', ' +
                  o +
                  ' -15,0 -2,1 -1,2 0,2 1,2 2,1 2,0 2,-1 1,-2 0,-2 -1,-2 11,0 m -18,3 1,2 1,1 2,1 m 4,-4 -1,-2 -1,-1 -2,-1 m -4,15 15,0 2,-1 1,-2 0,-2 -1,-2 -2,-1 -2,0 -2,1 -1,2 0,2 1,2 -11,0 m 18,-3 -1,-2 -1,-1 -2,-1 m -4,4 1,2 1,1 2,1',
              ),
              u.setAttribute('stroke', gt.SIGNS_COLOR),
              u.setAttribute('stroke-width', gt.SIGNS_STROKE),
              u.setAttribute('fill', 'none'),
              S.appendChild(u),
              gt.ADD_CLICK_AREA && S.appendChild(yt(n - 18, o)),
              S
            );
          case gt.SYMBOL_LEO:
            ((u = t),
              (n = e),
              (o =
                ((u = Math.round(u + -3 * gt.SYMBOL_SCALE)),
                (n = Math.round(n + 4 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (S =
                (o.setAttribute('id', wt(gt.SYMBOL_LEO)),
                o.setAttribute(
                  'transform',
                  'translate(' +
                    -u * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -n * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              S.setAttribute(
                'd',
                'm ' +
                  u +
                  ', ' +
                  n +
                  ' -2,-1 -1,0 -2,1 -1,2 0,1 1,2 2,1 1,0 2,-1 1,-2 0,-1 -1,-2 -5,-5 -1,-2 0,-3 1,-2 2,-1 3,-1 4,0 4,1 2,2 1,2 0,3 -1,3 -3,3 -1,2 0,2 1,2 2,0 1,-1 1,-2 m -13,-5 -2,-3 -1,-2 0,-3 1,-2 1,-1 m 7,-1 3,1 2,2 1,2 0,3 -1,3 -2,3',
              ),
              S.setAttribute('stroke', gt.SIGNS_COLOR),
              S.setAttribute('stroke-width', gt.SIGNS_STROKE),
              S.setAttribute('fill', 'none'),
              o.appendChild(S),
              gt.ADD_CLICK_AREA && o.appendChild(yt(u - 6, n - 13)),
              o
            );
          case gt.SYMBOL_VIRGO:
            var L = t,
              A = e,
              _ =
                ((L = Math.round(L + -9 * gt.SYMBOL_SCALE)),
                (A = Math.round(A + -5 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              h =
                (_.setAttribute('id', wt(gt.SYMBOL_VIRGO)),
                _.setAttribute(
                  'transform',
                  'translate(' +
                    -L * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -A * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              h.setAttribute(
                'd',
                'm ' +
                  L +
                  ', ' +
                  A +
                  ' 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245',
              ),
              h.setAttribute('stroke', gt.SIGNS_COLOR),
              h.setAttribute('stroke-width', gt.SIGNS_STROKE),
              h.setAttribute('fill', 'none'),
              _.appendChild(h),
              gt.ADD_CLICK_AREA && _.appendChild(yt(L, A)),
              _
            );
          case gt.SYMBOL_LIBRA:
            ((h = t),
              (L = e),
              (A =
                ((h = Math.round(h + -2 * gt.SYMBOL_SCALE)),
                (L = Math.round(L + -8 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (_ =
                (A.setAttribute('id', wt(gt.SYMBOL_LIBRA)),
                A.setAttribute(
                  'transform',
                  'translate(' +
                    -h * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -L * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              _.setAttribute(
                'd',
                'm ' +
                  h +
                  ', ' +
                  L +
                  ' c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z',
              ),
              _.setAttribute('stroke', gt.SIGNS_COLOR),
              _.setAttribute('stroke-width', gt.SIGNS_STROKE),
              _.setAttribute('fill', 'none'),
              A.appendChild(_),
              gt.ADD_CLICK_AREA && A.appendChild(yt(h - 6, L)),
              A
            );
          case gt.SYMBOL_SCORPIO:
            var O = t,
              p = e,
              d =
                ((O = Math.round(O + -9 * gt.SYMBOL_SCALE)),
                (p = Math.round(p + -4 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              l =
                (d.setAttribute('id', wt(gt.SYMBOL_SCORPIO)),
                d.setAttribute(
                  'transform',
                  'translate(' +
                    -O * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -p * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              l.setAttribute(
                'd',
                'm ' +
                  O +
                  ', ' +
                  p +
                  ' 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101',
              ),
              l.setAttribute('stroke', gt.SIGNS_COLOR),
              l.setAttribute('stroke-width', gt.SIGNS_STROKE),
              l.setAttribute('fill', 'none'),
              d.appendChild(l),
              gt.ADD_CLICK_AREA && d.appendChild(yt(O, p)),
              d
            );
          case gt.SYMBOL_SAGITTARIUS:
            ((l = t),
              (O = e),
              (p =
                ((l = Math.round(l + 7 * gt.SYMBOL_SCALE)),
                (O = Math.round(O + -9 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (d =
                (p.setAttribute('id', wt(gt.SYMBOL_SAGITTARIUS)),
                p.setAttribute(
                  'transform',
                  'translate(' +
                    -l * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -O * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              d.setAttribute(
                'd',
                'm ' +
                  l +
                  ', ' +
                  O +
                  ' -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575',
              ),
              d.setAttribute('stroke', gt.SIGNS_COLOR),
              d.setAttribute('stroke-width', gt.SIGNS_STROKE),
              d.setAttribute('fill', 'none'),
              p.appendChild(d),
              gt.ADD_CLICK_AREA && p.appendChild(yt(l - 12, O)),
              p
            );
          case gt.SYMBOL_CAPRICORN:
            var C = t,
              I = e,
              c =
                ((C = Math.round(C + -9 * gt.SYMBOL_SCALE)),
                (I = Math.round(I + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              E =
                (c.setAttribute('id', wt(gt.SYMBOL_CAPRICORN)),
                c.setAttribute(
                  'transform',
                  'translate(' +
                    -C * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -I * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              E.setAttribute(
                'd',
                'm ' +
                  C +
                  ', ' +
                  I +
                  ' 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816',
              ),
              E.setAttribute('stroke', gt.SIGNS_COLOR),
              E.setAttribute('stroke-width', gt.SIGNS_STROKE),
              E.setAttribute('fill', 'none'),
              c.appendChild(E),
              gt.ADD_CLICK_AREA && c.appendChild(yt(C, I)),
              c
            );
          case gt.SYMBOL_AQUARIUS:
            ((E = t),
              (C = e),
              (I =
                ((E = Math.round(E + -8 * gt.SYMBOL_SCALE)),
                (C = Math.round(C + -2 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (c =
                (I.setAttribute('id', wt(gt.SYMBOL_AQUARIUS)),
                I.setAttribute(
                  'transform',
                  'translate(' +
                    -E * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -C * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              c.setAttribute(
                'd',
                'm ' +
                  E +
                  ', ' +
                  C +
                  ' 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348',
              ),
              c.setAttribute('stroke', gt.SIGNS_COLOR),
              c.setAttribute('stroke-width', gt.SIGNS_STROKE),
              c.setAttribute('fill', 'none'),
              I.appendChild(c),
              gt.ADD_CLICK_AREA && I.appendChild(yt(E, C)),
              I
            );
          case gt.SYMBOL_PISCES:
            var k = t,
              x = e,
              G =
                ((k = Math.round(k + -8 * gt.SYMBOL_SCALE)),
                (x = Math.round(x + -8 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              v =
                (G.setAttribute('id', wt(gt.SYMBOL_PISCES)),
                G.setAttribute(
                  'transform',
                  'translate(' +
                    -k * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -x * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              v.setAttribute(
                'd',
                'm ' +
                  k +
                  ', ' +
                  x +
                  ' 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0',
              ),
              v.setAttribute('stroke', gt.SIGNS_COLOR),
              v.setAttribute('stroke-width', gt.SIGNS_STROKE),
              v.setAttribute('fill', 'none'),
              G.appendChild(v),
              gt.ADD_CLICK_AREA && G.appendChild(yt(k, x)),
              G
            );
          case gt.SYMBOL_AS:
            return (
              (v = t),
              (k = e),
              (v = Math.round(v + 12 * gt.SYMBOL_SCALE)),
              (k = Math.round(k + -2 * gt.SYMBOL_SCALE)),
              (x = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -v * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -k * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (G = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm ' +
                  v +
                  ', ' +
                  k +
                  ' -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0',
              ),
              G.setAttribute('stroke', gt.SYMBOL_AXIS_FONT_COLOR),
              G.setAttribute('stroke-width', gt.SYMBOL_AXIS_STROKE * gt.SYMBOL_SCALE),
              G.setAttribute('fill', 'none'),
              x
            );
          case gt.SYMBOL_ASCENDANT:
            return (
              (ot = t),
              (St = e),
              (ot = Math.round(ot + 12 * gt.SYMBOL_SCALE)),
              (St = Math.round(St + -2 * gt.SYMBOL_SCALE)),
              (ut = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -ot * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -St * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (Lt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm ' +
                  ot +
                  ', ' +
                  St +
                  ' -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0',
              ),
              Lt.setAttribute('stroke', gt.POINTS_COLOR),
              Lt.setAttribute('stroke-width', gt.POINTS_STROKE * gt.SYMBOL_SCALE),
              Lt.setAttribute('fill', 'none'),
              ut.appendChild(Lt),
              ut
            );
          case gt.SYMBOL_DS:
            return (
              (ot = t),
              (St = e),
              (ot = Math.round(ot + 22 * gt.SYMBOL_SCALE)),
              (St = Math.round(St + -1 * gt.SYMBOL_SCALE)),
              (Lt = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -ot * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -St * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (ut = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm ' +
                  ot +
                  ', ' +
                  St +
                  ' -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0',
              ),
              ut.setAttribute('stroke', gt.SYMBOL_AXIS_FONT_COLOR),
              ut.setAttribute('stroke-width', gt.SYMBOL_AXIS_STROKE * gt.SYMBOL_SCALE),
              ut.setAttribute('fill', 'none'),
              Lt
            );
          case gt.SYMBOL_MC:
            return (
              (it = t),
              (rt = e),
              (it = Math.round(it + 19 * gt.SYMBOL_SCALE)),
              (rt = Math.round(rt + -4 * gt.SYMBOL_SCALE)),
              (at = document.createElementNS(ft.root.namespaceURI, 'g')).setAttribute(
                'transform',
                'translate(' +
                  -it * (gt.SYMBOL_SCALE - 1) +
                  ',' +
                  -rt * (gt.SYMBOL_SCALE - 1) +
                  ') scale(' +
                  gt.SYMBOL_SCALE +
                  ')',
              ),
              (nt = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm ' +
                  it +
                  ', ' +
                  rt +
                  ' -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881',
              ),
              nt.setAttribute('stroke', gt.SYMBOL_AXIS_FONT_COLOR),
              nt.setAttribute('stroke-width', gt.SYMBOL_AXIS_STROKE * gt.SYMBOL_SCALE),
              nt.setAttribute('fill', 'none'),
              at
            );
          case gt.SYMBOL_IC:
          case gt.SYMBOL_IC:
            return xt(t, e);
          case gt.SYMBOL_CUSP_1:
            ((it = t),
              (rt = e),
              (nt =
                ((it = Math.round(it + 0 * gt.SYMBOL_SCALE)),
                (rt = Math.round(rt + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (at =
                (nt.setAttribute('id', kt(gt.SYMBOL_CUSP_1)),
                nt.setAttribute(
                  'transform',
                  'translate(' +
                    -it * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -rt * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              at.setAttribute(
                'd',
                'm' +
                  it +
                  ', ' +
                  rt +
                  ' -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463',
              ),
              at.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              at.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              at.setAttribute('fill', 'none'),
              nt.appendChild(at),
              gt.ADD_CLICK_AREA && nt.appendChild(yt(it, rt)),
              nt
            );
          case gt.SYMBOL_CUSP_2:
            var m = t,
              R = e,
              M =
                ((m = Math.round(m + -2 * gt.SYMBOL_SCALE)),
                (R = Math.round(R + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              K =
                (M.setAttribute('id', kt(gt.SYMBOL_CUSP_2)),
                M.setAttribute(
                  'transform',
                  'translate(' +
                    -m * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -R * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              K.setAttribute(
                'd',
                'm' +
                  m +
                  ', ' +
                  R +
                  ' 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455',
              ),
              K.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              K.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              K.setAttribute('fill', 'none'),
              M.appendChild(K),
              gt.ADD_CLICK_AREA && M.appendChild(yt(m, R)),
              M
            );
          case gt.SYMBOL_CUSP_3:
            ((K = t),
              (m = e),
              (R =
                ((K = Math.round(K + -2 * gt.SYMBOL_SCALE)),
                (m = Math.round(m + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (M =
                (R.setAttribute('id', kt(gt.SYMBOL_CUSP_3)),
                R.setAttribute(
                  'transform',
                  'translate(' +
                    -K * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -m * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              M.setAttribute(
                'd',
                'm' +
                  K +
                  ', ' +
                  m +
                  ' 0,-0.4545454 0.45454549,0 0,0.9090909 -0.90909089,0 0,-0.9090909 0.4545454,-0.9090909 0.45454549,-0.4545455 1.36363636,-0.4545454 1.36363635,0 1.3636364,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.4545455,0.4545454 -0.9090909,0.4545455 -1.36363635,0.4545454 m 2.27272725,-4.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.4545454,0.4545454 m -0.4545455,-3.6363636 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -0.90909095,0.4545454 m -0.9090909,0 0.9090909,0 1.36363635,0.4545455 0.4545455,0.45454542 0.4545454,0.90909091 0,1.36363637 -0.4545454,0.9090909 -0.9090909,0.4545455 -1.3636364,0.4545454 -1.3636364,0 -1.3636363,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.90909091 0.9090909,0 0,0.90909091 -0.4545455,0 0,-0.45454546 m 5,-1.81818182 0.4545455,0.90909091 0,1.36363637 -0.4545455,0.9090909 m -1.36363635,-4.0909091 0.90909095,0.4545455 0.4545454,0.90909088 0,1.81818182 -0.4545454,0.9090909 -0.45454549,0.4545455 -0.90909091,0.4545454',
              ),
              M.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              M.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              M.setAttribute('fill', 'none'),
              R.appendChild(M),
              gt.ADD_CLICK_AREA && R.appendChild(yt(K, m)),
              R
            );
          case gt.SYMBOL_CUSP_4:
            var F = t,
              X = e,
              H =
                ((F = Math.round(F + +gt.SYMBOL_SCALE)),
                (X = Math.round(X + -4 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              V =
                (H.setAttribute('id', kt(gt.SYMBOL_CUSP_4)),
                H.setAttribute(
                  'transform',
                  'translate(' +
                    -F * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -X * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              V.setAttribute(
                'd',
                'm' +
                  F +
                  ', ' +
                  X +
                  ' -2.28678383,7.7750651 0.91471356,0 m 2.74414057,-9.6044922 -0.9147135,1.8294271 -2.28678386,7.7750651 m 3.20149736,-9.6044922 -2.74414057,9.6044922 m 2.74414057,-9.6044922 -7.3177083,6.8603516 7.3177083,0',
              ),
              V.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              V.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              V.setAttribute('fill', 'none'),
              H.appendChild(V),
              gt.ADD_CLICK_AREA && H.appendChild(yt(F, X)),
              H
            );
          case gt.SYMBOL_CUSP_5:
            ((V = t),
              (F = e),
              (X =
                ((V = Math.round(V + -2 * gt.SYMBOL_SCALE)),
                (F = Math.round(F + -5 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (H =
                (X.setAttribute('id', kt(gt.SYMBOL_CUSP_5)),
                X.setAttribute(
                  'transform',
                  'translate(' +
                    -V * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -F * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              H.setAttribute(
                'd',
                'm' +
                  V +
                  ', ' +
                  F +
                  ' -2.27272725,4.5454545 m 2.27272725,-4.5454545 4.54545455,0 m -4.54545455,0.4545454 3.63636365,0 m -4.0909091,0.4545455 2.2727273,0 1.8181818,-0.4545455 0.9090909,-0.4545454 m -6.8181818,4.5454545 0.4545454,-0.4545454 1.3636364,-0.4545455 1.36363636,0 1.36363634,0.4545455 0.4545455,0.4545454 0.4545454,0.90909092 0,1.36363638 -0.4545454,1.3636364 -0.9090909,0.9090909 -1.81818185,0.4545454 -1.36363635,0 -0.9090909,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.9090909 0.9090909,0 0,0.9090909 -0.4545455,0 0,-0.45454545 m 5,-2.72727275 0.4545455,0.90909092 0,1.36363638 -0.4545455,1.3636364 -0.9090909,0.9090909 m -0.45454544,-5.4545455 0.90909094,0.4545455 0.4545454,0.9090909 0,1.8181818 -0.4545454,1.3636364 -0.90909094,0.9090909 -0.90909091,0.4545454',
              ),
              H.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              H.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              H.setAttribute('fill', 'none'),
              X.appendChild(H),
              gt.ADD_CLICK_AREA && X.appendChild(yt(V, F)),
              X
            );
          case gt.SYMBOL_CUSP_6:
            var W = t,
              Z = e,
              q =
                ((W = Math.round(W + 3 * gt.SYMBOL_SCALE)),
                (Z = Math.round(Z + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              z =
                (q.setAttribute('id', kt(gt.SYMBOL_CUSP_6)),
                q.setAttribute(
                  'transform',
                  'translate(' +
                    -W * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -Z * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              z.setAttribute(
                'd',
                'm' +
                  W +
                  ', ' +
                  Z +
                  ' 0,-0.4545455 -0.4545455,0 0,0.9090909 0.9090909,0 0,-0.9090909 -0.4545454,-0.9090909 -0.909091,-0.4545454 -1.3636363,0 -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 1.36363637,0 1.36363633,-0.4545454 0.9090909,-0.9090909 0.4545455,-0.90909096 0,-1.36363636 -0.4545455,-0.90909088 -0.4545454,-0.4545455 -0.9090909,-0.4545454 -1.36363638,0 -0.90909092,0.4545454 -0.4545454,0.4545455 -0.4545455,0.90909088 m 1.36363636,-4.54545458 -0.90909086,1.3636364 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 4.0909091,-0.4545454 0.4545454,-0.90909096 0,-1.36363636 -0.4545454,-0.90909088 m -0.9090909,-5 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 1.36363637,0 0.90909093,-0.4545454 0.4545454,-0.4545455 0.4545455,-1.36363636 0,-1.81818182 -0.4545455,-0.90909092 -0.4545454,-0.4545454',
              ),
              z.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              z.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              z.setAttribute('fill', 'none'),
              q.appendChild(z),
              gt.ADD_CLICK_AREA && q.appendChild(yt(W, Z)),
              q
            );
          case gt.SYMBOL_CUSP_7:
            ((z = t),
              (W = e),
              (Z =
                ((z = Math.round(z + -4 * gt.SYMBOL_SCALE)),
                (W = Math.round(W + -4 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (q =
                (Z.setAttribute('id', kt(gt.SYMBOL_CUSP_7)),
                Z.setAttribute(
                  'transform',
                  'translate(' +
                    -z * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -W * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              q.setAttribute(
                'd',
                'm' +
                  z +
                  ', ' +
                  W +
                  ' -0.9090909,2.7272727 m 6.8181818,-2.7272727 -0.4545454,1.3636363 -0.909091,1.3636364 -1.8181818,2.2727273 -0.90909088,1.36363633 -0.45454546,1.36363637 -0.45454545,1.8181818 m 0.90909091,-3.63636362 -0.90909091,1.81818182 -0.45454546,1.8181818 m 4.09090905,-6.8181818 -2.72727268,2.72727272 -0.90909091,1.36363637 -0.45454546,0.90909091 -0.45454545,1.8181818 0.90909091,0 m -1.36363641,-8.1818182 1.36363641,-1.3636363 0.90909091,0 2.27272728,1.3636363 m -3.63636365,-0.9090909 1.36363637,0 2.27272728,0.9090909 m -4.5454546,0 0.90909095,-0.4545454 1.36363637,0 2.27272728,0.4545454 0.9090909,0 0.4545455,-0.4545454 0.4545454,-0.9090909',
              ),
              q.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              q.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              q.setAttribute('fill', 'none'),
              Z.appendChild(q),
              gt.ADD_CLICK_AREA && Z.appendChild(yt(z, W)),
              Z
            );
          case gt.SYMBOL_CUSP_8:
            var J = t,
              Q = e,
              j =
                ((J = Math.round(J + -1 * gt.SYMBOL_SCALE)),
                (Q = Math.round(Q + -5 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              $ =
                (j.setAttribute('id', kt(gt.SYMBOL_CUSP_8)),
                j.setAttribute(
                  'transform',
                  'translate(' +
                    -J * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -Q * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              $.setAttribute(
                'd',
                'm' +
                  J +
                  ', ' +
                  Q +
                  ' -1.3631244,0.4543748 -0.4543748,0.4543748 -0.4543748,0.9087496 0,1.3631244 0.4543748,0.9087496 0.9087496,0.4543748 1.3631244,0 1.3631244,-0.4543748 0.9087496,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 -0.9087496,-0.4543748 -1.8174992,0 m 0.9087496,0 -2.271874,0.4543748 m 0,0.4543748 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.4543748 m -0.4543748,0 1.3631244,0.4543748 m 0.4543748,0 1.8174992,-0.4543748 m 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 m 0.4543748,0 -1.8174992,-0.4543748 m -0.9087496,0 -0.9087496,0.9087496 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.9087496 m 1.3631244,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.8174992 -0.4543748,-0.9087496 m -2.7262488,4.543748 -1.8174992,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 1.3631244,0.4543748 1.8174992,0 1.8174992,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 -0.4543748,-0.45437484 -0.9087496,-0.4543748 m -0.9087496,0 -2.271874,0.4543748 m 0.4543748,0 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 m -0.4543748,0 2.271874,0.4543748 2.7262488,-0.4543748 m 0,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 m 0,-0.45437484 -1.3631244,-0.4543748 m -0.9087496,0 -0.9087496,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 0.4543748,0.4543748 m 1.8174992,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.81749916 -0.4543748,-0.90874964 -0.4543748,-0.4543748',
              ),
              $.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              $.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              $.setAttribute('fill', 'none'),
              j.appendChild($),
              gt.ADD_CLICK_AREA && j.appendChild(yt(J, Q)),
              j
            );
          case gt.SYMBOL_CUSP_9:
            (($ = t),
              (J = e),
              (Q =
                (($ = Math.round($ + +gt.SYMBOL_SCALE)),
                (J = Math.round(J + -2 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (j =
                (Q.setAttribute('id', kt(gt.SYMBOL_CUSP_9)),
                Q.setAttribute(
                  'transform',
                  'translate(' +
                    -$ * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -J * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              j.setAttribute(
                'd',
                'm' +
                  $ +
                  ', ' +
                  J +
                  ' -0.4545455,0.9090909 -0.4545454,0.4545455 -0.9090909,0.45454542 -1.36363638,0 -0.90909092,-0.45454542 -0.4545454,-0.4545455 -0.4545455,-0.9090909 0,-1.3636364 0.4545455,-0.9090909 0.90909086,-0.9090909 1.36363637,-0.4545454 1.36363637,0 0.9090909,0.4545454 0.4545455,0.4545455 0.4545454,1.3636363 0,1.3636364 -0.4545454,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 -0.9090909,0.9090909 -1.36363638,0.4545454 -1.36363632,0 -0.909091,-0.4545454 -0.4545454,-0.9090909 0,-0.90909096 0.9090909,0 0,0.90909096 -0.4545455,0 0,-0.4545455 m 1.3636364,-3.1818182 -0.4545454,-0.9090909 0,-1.3636364 0.4545454,-0.9090909 m 4.0909091,-0.4545454 0.4545455,0.9090909 0,1.8181818 -0.4545455,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 m -1.81818178,-2.72727278 -0.45454546,-0.45454542 -0.45454546,-0.9090909 0,-1.8181819 0.45454546,-1.3636363 0.45454546,-0.4545455 0.90909091,-0.4545454 m 1.36363637,0 0.4545454,0.4545454 0.4545455,0.9090909 0,2.2727273 -0.4545455,1.81818182 -0.4545454,1.36363637 -0.4545455,0.90909091 -0.90909087,1.3636364 -0.90909091,0.4545454',
              ),
              j.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              j.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              j.setAttribute('fill', 'none'),
              Q.appendChild(j),
              gt.ADD_CLICK_AREA && Q.appendChild(yt($, J)),
              Q
            );
          case gt.SYMBOL_CUSP_10:
            var N = t,
              B = e,
              Y =
                ((N = Math.round(N + -3 * gt.SYMBOL_SCALE)),
                (B = Math.round(B + -3.5 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              b =
                (Y.setAttribute('id', kt(gt.SYMBOL_CUSP_10)),
                Y.setAttribute(
                  'transform',
                  'translate(' +
                    -N * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -B * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              b.setAttribute(
                'd',
                'm' +
                  N +
                  ', ' +
                  B +
                  ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915',
              ),
              b.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              b.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              b.setAttribute('fill', 'none'),
              Y.appendChild(b),
              (b = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (N + 6.5) +
                  ', ' +
                  (B + -1.5) +
                  ' -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 0.90909092,0 1.36363638,-0.4545454 0.9090909,-0.9090909 0.9090909,-1.36363641 0.4545455,-1.36363637 0.4545454,-1.81818182 0,-1.3636364 -0.4545454,-1.3636363 -0.4545455,-0.4545455 -0.9090909,-0.4545454 -0.9090909,0 m -1.36363638,0.9090909 -0.90909092,0.9090909 -0.4545454,0.9090909 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 3.1818182,0 0.9090909,-0.9090909 0.4545454,-0.90909091 0.4545455,-1.36363637 0.4545455,-1.81818182 0,-1.8181818 -0.4545455,-0.9090909 m -1.8181818,-0.9090909 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 0.90909092,0 0.90909091,-0.4545454 0.90909087,-1.3636364 0.4545455,-0.90909091 0.4545454,-1.36363637 0.4545455,-1.81818182 0,-2.2727273 -0.4545455,-0.9090909 -0.4545454,-0.4545454',
              ),
              b.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              b.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              b.setAttribute('fill', 'none'),
              Y.appendChild(b),
              gt.ADD_CLICK_AREA && Y.appendChild(yt(N, B)),
              Y
            );
          case gt.SYMBOL_CUSP_11:
            ((b = t),
              (N = e),
              (B =
                ((b = Math.round(b + -3 * gt.SYMBOL_SCALE)),
                (N = Math.round(N + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g'))),
              (Y =
                (B.setAttribute('id', kt(gt.SYMBOL_CUSP_11)),
                B.setAttribute(
                  'transform',
                  'translate(' +
                    -b * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -N * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'))));
            return (
              Y.setAttribute(
                'd',
                'm' +
                  b +
                  ', ' +
                  N +
                  ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915',
              ),
              Y.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              Y.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              Y.setAttribute('fill', 'none'),
              B.appendChild(Y),
              (Y = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (b + 6) +
                  ', ' +
                  (N + 0) +
                  ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915',
              ),
              Y.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              Y.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              Y.setAttribute('fill', 'none'),
              B.appendChild(Y),
              gt.ADD_CLICK_AREA && B.appendChild(yt(b, N)),
              B
            );
          case gt.SYMBOL_CUSP_12:
            var tt = t,
              et = e,
              st =
                ((tt = Math.round(tt + -3 * gt.SYMBOL_SCALE)),
                (et = Math.round(et + -3 * gt.SYMBOL_SCALE)),
                document.createElementNS(ft.root.namespaceURI, 'g')),
              T =
                (st.setAttribute('id', kt(gt.SYMBOL_CUSP_12)),
                st.setAttribute(
                  'transform',
                  'translate(' +
                    -tt * (gt.SYMBOL_SCALE - 1) +
                    ',' +
                    -et * (gt.SYMBOL_SCALE - 1) +
                    ') scale(' +
                    gt.SYMBOL_SCALE +
                    ')',
                ),
                document.createElementNS(ft.root.namespaceURI, 'path'));
            return (
              T.setAttribute(
                'd',
                'm' +
                  tt +
                  ', ' +
                  et +
                  ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915',
              ),
              T.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              T.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              T.setAttribute('fill', 'none'),
              st.appendChild(T),
              (T = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
                'd',
                'm' +
                  (tt + 4) +
                  ', ' +
                  (et + 1) +
                  ' 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455',
              ),
              T.setAttribute('stroke', gt.CUSPS_FONT_COLOR),
              T.setAttribute('stroke-width', gt.CUSPS_STROKE * gt.SYMBOL_SCALE),
              T.setAttribute('fill', 'none'),
              st.appendChild(T),
              gt.ADD_CLICK_AREA && st.appendChild(yt(tt, et)),
              st
            );
          default:
            T = this.circle(t, e, 8);
            return (
              T.setAttribute('stroke', '#ffff00'),
              T.setAttribute('stroke-width', 1),
              T.setAttribute('fill', '#ff0000'),
              T
            );
        }
        var it,
          rt,
          at,
          nt,
          ot,
          St,
          ut,
          Lt,
          At,
          _t,
          ht,
          Ot,
          pt,
          dt,
          lt,
          P,
          Ct,
          It,
          D,
          ct,
          U,
          g,
          f,
          Et,
          mt,
          Rt,
          Mt,
          Nt,
          Bt,
          Yt,
          bt,
          y,
          Tt,
          Pt,
          Dt,
          Ut;
      }),
      (gt.SVG.prototype.getSymbol = function (t, e, s) {
        var i;
        return null == gt.CUSTOM_SYMBOL_FN || null == (i = gt.CUSTOM_SYMBOL_FN(t, e, s, ft))
          ? gt.SVG.prototype._getSymbol(t, e, s)
          : i;
      }),
      (gt.SVG.prototype.segment = function (t, e, s, i, r, a, n, o) {
        var S,
          n = n || 0,
          o = o || 0;
        return (
          (i = (((gt.SHIFT_IN_DEGREES - i) % 360) * Math.PI) / 180),
          (r = (((gt.SHIFT_IN_DEGREES - r) % 360) * Math.PI) / 180),
          (S = document.createElementNS(ft.root.namespaceURI, 'path')).setAttribute(
            'd',
            'M ' +
              (t + a * Math.cos(i)) +
              ', ' +
              (e + a * Math.sin(i)) +
              ' l ' +
              (s - a) * Math.cos(i) +
              ', ' +
              (s - a) * Math.sin(i) +
              ' A ' +
              s +
              ', ' +
              s +
              ',0 ,' +
              n +
              ', ' +
              o +
              ', ' +
              (t + s * Math.cos(r)) +
              ', ' +
              (e + s * Math.sin(r)) +
              ' l ' +
              (s - a) * -Math.cos(r) +
              ', ' +
              (s - a) * -Math.sin(r) +
              ' A ' +
              a +
              ', ' +
              a +
              ',0 ,' +
              n +
              ', 1, ' +
              (t + a * Math.cos(i)) +
              ', ' +
              (e + a * Math.sin(i)),
          ),
          S.setAttribute('fill', 'none'),
          S
        );
      }),
      (gt.SVG.prototype.line = function (t, e, s, i, r) {
        var a;
        return (
          (a = document.createElementNS(ft.root.namespaceURI, 'line')).setAttribute('x1', t),
          a.setAttribute('y1', e),
          a.setAttribute('x2', s),
          a.setAttribute('y2', i),
          a
        );
      }),
      (gt.SVG.prototype.circle = function (t, e, s) {
        var i;
        return (
          (i = document.createElementNS(ft.root.namespaceURI, 'circle')).setAttribute('cx', t),
          i.setAttribute('cy', e),
          i.setAttribute('r', s),
          i.setAttribute('fill', 'none'),
          i
        );
      }),
      (gt.SVG.prototype.text = function (t, e, s, i, r) {
        var a;
        return (
          (a = document.createElementNS(ft.root.namespaceURI, 'text')).setAttribute('x', e),
          a.setAttribute('y', s),
          a.setAttribute('font-size', i),
          a.setAttribute('fill', r),
          a.setAttribute('font-family', 'serif'),
          a.setAttribute('dominant-baseline', 'central'),
          a.appendChild(document.createTextNode(t)),
          a.setAttribute(
            'transform',
            'translate(' +
              -e * (gt.SYMBOL_SCALE - 1) +
              ',' +
              -s * (gt.SYMBOL_SCALE - 1) +
              ') scale(' +
              gt.SYMBOL_SCALE +
              ')',
          ),
          a
        );
      }));
  })((window.astrology = window.astrology || {})),
  (function (S) {
    ((S.Chart = function (t, e, s, i) {
      return (
        i &&
          (Object.assign(S, i),
          'COLORS_SIGNS' in i ||
            (S.COLORS_SIGNS = [
              S.COLOR_ARIES,
              S.COLOR_TAURUS,
              S.COLOR_GEMINI,
              S.COLOR_CANCER,
              S.COLOR_LEO,
              S.COLOR_VIRGO,
              S.COLOR_LIBRA,
              S.COLOR_SCORPIO,
              S.COLOR_SAGITTARIUS,
              S.COLOR_CAPRICORN,
              S.COLOR_AQUARIUS,
              S.COLOR_PISCES,
            ])),
        t &&
          !document.getElementById(t) &&
          ((i = document.createElement('div')).setAttribute('id', t), document.body.appendChild(i)),
        (this.paper = new S.SVG(t, e, s)),
        (this.cx = this.paper.width / 2),
        (this.cy = this.paper.height / 2),
        (this.radius = this.paper.height / 2 - S.MARGIN),
        this
      );
    }),
      (S.Chart.prototype.radix = function (t) {
        t = new S.Radix(this.paper, this.cx, this.cy, this.radius, t);
        return (
          t.drawBg(),
          t.drawUniverse(),
          t.drawRuler(),
          t.drawPoints(),
          t.drawCusps(),
          t.drawAxis(),
          t.drawCircles(),
          t
        );
      }),
      (S.Chart.prototype.scale = function (t) {
        this.paper.root.setAttribute(
          'transform',
          'translate(' + -this.cx * (t - 1) + ',' + -this.cy * (t - 1) + ') scale(' + t + ')',
        );
      }),
      (S.Chart.prototype.calibrate = function () {
        for (
          var t,
            e,
            s,
            i = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'ascendant'],
            r = 0;
          r < i.length;
          r++
        )
          ((t = S.utils.getPointPosition(this.cx, this.cy, 2 * this.radius, 30 * r)),
            (s = this.paper.line(this.cx, this.cy, t.x, t.y)).setAttribute('stroke', S.LINE_COLOR),
            this.paper.root.appendChild(s),
            (e = this.paper.circle(this.cx, this.cy, 60 + 60 * r)).setAttribute('stroke', S.LINE_COLOR),
            e.setAttribute('stroke-width', 1),
            this.paper.root.appendChild(e));
        for (var a = 0, n = i.length; a < n; a++)
          for (var o = 60 + 60 * a, r = 0; r < 10; r++)
            ((t = S.utils.getPointPosition(this.cx, this.cy, o, 30 * r)),
              (e = this.paper.circle(t.x, t.y, S.COLLISION_RADIUS * S.SYMBOL_SCALE)).setAttribute('stroke', 'red'),
              e.setAttribute('stroke-width', 1),
              this.paper.root.appendChild(e),
              this.paper.root.appendChild(this.paper.getSymbol(i[a], t.x, t.y)));
        return this;
      }));
  })((window.astrology = window.astrology || {})),
  (function (u) {
    var S;
    ((u.Radix = function (t, e, s, i, r) {
      var a,
        n = u.utils.validate(r);
      if (n.hasError) throw new Error(n.messages);
      ((this.data = r),
        (this.paper = t),
        (this.cx = e),
        (this.cy = s),
        (this.radius = i),
        (this.locatedPoints = []),
        (this.rulerRadius = this.radius / u.INNER_CIRCLE_RADIUS_RATIO / u.RULER_RADIUS),
        (this.pointRadius =
          this.radius -
          (this.radius / u.INNER_CIRCLE_RADIUS_RATIO + 2 * this.rulerRadius + u.PADDING * u.SYMBOL_SCALE)),
        (this.toPoints = JSON.parse(JSON.stringify(this.data.planets))),
        (this.shift = 0),
        (this.shiftForSigns = 0),
        this.data.cusps &&
          this.data.cusps[0] &&
          ((a = u.utils.radiansToDegree(2 * Math.PI)), (this.shift = a - this.data.cusps[0])),
        this.data.planets &&
          this.data.planets.Ascendant &&
          this.data.planets.Ascendant[0] &&
          ((a = u.utils.radiansToDegree(2 * Math.PI)), (this.shiftForSigns = a - this.data.planets.Ascendant[0])));
      n = document.createElementNS(this.paper.root.namespaceURI, 'g');
      return (
        n.setAttribute('id', u._paperElementId + '-' + u.ID_ASPECTS),
        this.paper.root.appendChild(n),
        (this.universe = document.createElementNS(this.paper.root.namespaceURI, 'g')),
        this.universe.setAttribute('id', u._paperElementId + '-' + u.ID_RADIX),
        this.paper.root.appendChild(this.universe),
        (S = this)
      );
    }),
      (u.Radix.prototype.drawBg = function () {
        var t = this.universe,
          t = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_BG),
          e = this.paper.segment(
            this.cx,
            this.cy,
            this.radius - this.radius / u.INNER_CIRCLE_RADIUS_RATIO,
            0,
            359.99,
            this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
            1,
          );
        (e.setAttribute('fill', u.STROKE_ONLY ? 'none' : u.COLOR_BACKGROUND), t.appendChild(e));
      }),
      (u.Radix.prototype.drawUniverse = function () {
        for (
          var t = this.universe,
            e = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_SIGNS),
            s = 0,
            i = 30,
            r = this.shiftForSigns,
            a = u.COLORS_SIGNS.length;
          s < a;
          s++
        ) {
          var n = this.paper.segment(
            this.cx,
            this.cy,
            this.radius,
            r + 0.5,
            r + i,
            this.radius - this.radius / u.INNER_CIRCLE_RADIUS_RATIO,
          );
          (n.setAttribute('fill', u.STROKE_ONLY ? 'none' : u.COLORS_SIGNS[s]),
            n.setAttribute('id', u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_SIGNS + '-' + s),
            n.setAttribute('stroke', u.STROKE_ONLY ? u.CIRCLE_COLOR : 'none'),
            n.setAttribute('stroke-width', u.STROKE_ONLY ? 1 : 0),
            e.appendChild(n),
            (r += i));
        }
        for (s = 0, i = 30, r = 15 + this.shiftForSigns, a = u.SYMBOL_SIGNS.length; s < a; s++) {
          var o = u.utils.getPointPosition(
            this.cx,
            this.cy,
            this.radius - this.radius / u.INNER_CIRCLE_RADIUS_RATIO / 2,
            r,
          );
          (e.appendChild(this.paper.getSymbol(u.SYMBOL_SIGNS[s], o.x, o.y)), (r += i));
        }
      }),
      (u.Radix.prototype.drawPoints = function () {
        if (null != this.data.planets) {
          var i,
            r,
            t,
            e,
            s = this.universe,
            a = u.utils.getEmptyWrapper(s, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_POINTS),
            n =
              (this.radius,
              this.radius,
              u.INNER_CIRCLE_RADIUS_RATIO,
              this.radius,
              u.INDOOR_CIRCLE_RADIUS_RATIO,
              u.PADDING,
              u.SYMBOL_SCALE,
              Object.keys(this.data.planets).length,
              this.radius - (this.radius / u.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius));
          for (t in this.data.planets)
            this.data.planets.hasOwnProperty(t) &&
              ((e = {
                name: t,
                x: (e = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  this.pointRadius,
                  this.data.planets[t][0] + this.shiftForSigns,
                )).x,
                y: e.y,
                r: u.COLLISION_RADIUS * u.SYMBOL_SCALE,
                angle: this.data.planets[t][0] + this.shiftForSigns,
                pointer: this.data.planets[t][0] + this.shiftForSigns,
              }),
              (this.locatedPoints = u.utils.assemble(this.locatedPoints, e, {
                cx: this.cx,
                cy: this.cy,
                r: this.pointRadius,
              })));
          (u.DEBUG && console.log('Radix count of points: ' + this.locatedPoints.length),
            u.DEBUG && console.log('Radix located points:\n' + JSON.stringify(this.locatedPoints)),
            this.locatedPoints.forEach(function (t) {
              ((i = u.utils.getPointPosition(this.cx, this.cy, n, this.data.planets[t.name][0] + this.shiftForSigns)),
                (r = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  n - this.rulerRadius / 2,
                  this.data.planets[t.name][0] + this.shiftForSigns,
                )));
              var e = this.paper.line(i.x, i.y, r.x, r.y),
                e =
                  (e.setAttribute('stroke', u.CIRCLE_COLOR),
                  e.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
                  a.appendChild(e),
                  u.STROKE_ONLY ||
                    this.data.planets[t.name][0] + this.shiftForSigns == t.angle ||
                    ((i = r),
                    (r = u.utils.getPointPosition(
                      this.cx,
                      this.cy,
                      this.pointRadius + u.COLLISION_RADIUS * u.SYMBOL_SCALE,
                      t.angle,
                    )),
                    (e = this.paper.line(i.x, i.y, r.x, r.y)).setAttribute('stroke', u.LINE_COLOR),
                    e.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE * 0.5),
                    a.appendChild(e)),
                  this.paper.getSymbol(t.name, t.x, t.y)),
                e =
                  (e.setAttribute('id', u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_POINTS + '-' + t.name),
                  a.appendChild(e),
                  [(Math.round(this.data.planets[t.name][0]) % 30).toString()]),
                s = new u.Zodiac(this.data.cusps);
              (this.data.planets[t.name][1] && s.isRetrograde(this.data.planets[t.name][1]) ? e.push('R') : e.push(''),
                (e = e.concat(
                  s
                    .getDignities(
                      { name: t.name, position: this.data.planets[t.name][0] },
                      u.DIGNITIES_EXACT_EXALTATION_DEFAULT,
                    )
                    .join(','),
                )),
                u.utils.getDescriptionPosition(t, e).forEach(function (t) {}, this));
            }, this));
        }
      }),
      (u.Radix.prototype.drawAxis = function () {
        var t, e, s, i, r;
        null != this.data.cusps &&
          ((t = this.universe),
          (e = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_AXIS)),
          (s = this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO / 4),
          [0, 3, 6, 9].forEach(function (t) {
            ((i = u.utils.getPointPosition(this.cx, this.cy, this.radius, this.data.cusps[t] + this.shift)),
              (r = u.utils.getPointPosition(this.cx, this.cy, s, this.data.cusps[t] + this.shift)),
              (i = this.paper.line(i.x, i.y, r.x, r.y)).setAttribute('stroke', u.LINE_COLOR),
              i.setAttribute('stroke-width', u.SYMBOL_AXIS_STROKE * u.SYMBOL_SCALE),
              0 == t &&
                ((textPosition = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  s + 20 * u.SYMBOL_SCALE,
                  this.data.cusps[t] + this.shift,
                )),
                e.appendChild(this.paper.getSymbol(u.SYMBOL_AS, textPosition.x, textPosition.y))),
              6 == t &&
                ((textPosition = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  s + 2 * u.SYMBOL_SCALE,
                  this.data.cusps[t] + this.shift,
                )),
                e.appendChild(this.paper.getSymbol(u.SYMBOL_DS, textPosition.x, textPosition.y))),
              3 == t &&
                ((textPosition = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  s + 10 * u.SYMBOL_SCALE,
                  this.data.cusps[t] - 2 + this.shift,
                )),
                e.appendChild(this.paper.getSymbol(u.SYMBOL_IC, textPosition.x, textPosition.y))),
              9 == t &&
                ((textPosition = u.utils.getPointPosition(
                  this.cx,
                  this.cy,
                  s + 10 * u.SYMBOL_SCALE,
                  this.data.cusps[t] + 2 + this.shift,
                )),
                e.appendChild(this.paper.getSymbol(u.SYMBOL_MC, textPosition.x, textPosition.y))));
          }, this));
      }),
      (u.Radix.prototype.drawCusps = function () {
        if (null != this.data.cusps)
          for (
            var t = this.universe,
              e = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_CUSPS),
              s = this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO + u.COLLISION_RADIUS * u.SYMBOL_SCALE,
              i = [0, 3, 6, 9],
              r = 0,
              a = this.data.cusps.length;
            r < a;
            r++
          ) {
            u.utils
              .getDashedLinesPositions(
                this.cx,
                this.cy,
                this.data.cusps[r] + this.shift,
                this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
                this.radius - (this.radius / u.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius),
                this.pointRadius,
                this.locatedPoints,
              )
              .forEach(function (t) {
                ((t = this.paper.line(t.startX, t.startY, t.endX, t.endY)).setAttribute('stroke', u.LINE_COLOR),
                  -1 != i.indexOf(r)
                    ? t.setAttribute('stroke-width', u.SYMBOL_AXIS_STROKE * u.SYMBOL_SCALE)
                    : t.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
                  e.appendChild(t));
              }, this);
            var n = u.utils.radiansToDegree(2 * Math.PI),
              o = this.data.cusps[r],
              S = this.data.cusps[(r + 1) % 12],
              S = u.utils.getPointPosition(
                this.cx,
                this.cy,
                s,
                ((o + (0 < S - o ? S - o : S - o + n) / 2) % n) + this.shift,
              );
            e.appendChild(this.paper.getSymbol((r + 1).toString(), S.x, S.y));
          }
      }),
      (u.Radix.prototype.aspects = function (t) {
        for (
          var e = null != t && Array.isArray(t) ? t : new u.AspectCalculator(this.toPoints).radix(this.data.planets),
            t = this.universe,
            s = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_ASPECTS),
            i = [],
            r = 0,
            a = e.length;
          r < a;
          r++
        ) {
          var n = e[r].aspect.name + '-' + e[r].point.name + '-' + e[r].toPoint.name,
            o = e[r].aspect.name + '-' + e[r].toPoint.name + '-' + e[r].point.name;
          -1 == i.indexOf(o) &&
            (i.push(n),
            (o = u.utils.getPointPosition(
              this.cx,
              this.cy,
              this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
              e[r].toPoint.position + this.shiftForSigns,
            )),
            (n = u.utils.getPointPosition(
              this.cx,
              this.cy,
              this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
              e[r].point.position + this.shiftForSigns,
            )),
            (o = this.paper.line(o.x, o.y, n.x, n.y)).setAttribute(
              'stroke',
              u.STROKE_ONLY ? u.LINE_COLOR : e[r].aspect.color,
            ),
            o.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
            o.setAttribute('data-name', e[r].aspect.name),
            o.setAttribute('data-degree', e[r].aspect.degree),
            o.setAttribute('data-point', e[r].point.name),
            o.setAttribute('data-toPoint', e[r].toPoint.name),
            o.setAttribute('data-precision', e[r].precision),
            s.appendChild(o));
        }
        return S;
      }),
      (u.Radix.prototype.addPointsOfInterest = function (t) {
        for (point in t) this.toPoints[point] = t[point];
        return S;
      }),
      (u.Radix.prototype.drawRuler = function () {
        var t = this.universe,
          e = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_RULER),
          t = this.radius - (this.radius / u.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius);
        (u.utils.getRulerPositions(this.cx, this.cy, t, t + this.rulerRadius, this.shift).forEach(function (t) {
          t = this.paper.line(t.startX, t.startY, t.endX, t.endY);
          (t.setAttribute('stroke', u.CIRCLE_COLOR),
            t.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
            e.appendChild(t));
        }, this),
          (t = this.paper.circle(this.cx, this.cy, t)).setAttribute('stroke', u.CIRCLE_COLOR),
          t.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
          e.appendChild(t));
      }),
      (u.Radix.prototype.drawCircles = function () {
        var t = this.universe,
          t = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_CIRCLES),
          e = this.paper.circle(this.cx, this.cy, this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO);
        (e.setAttribute('stroke', u.CIRCLE_COLOR),
          e.setAttribute('stroke-width', u.CIRCLE_STRONG * u.SYMBOL_SCALE),
          t.appendChild(e),
          (e = this.paper.circle(this.cx, this.cy, this.radius)).setAttribute('stroke', u.CIRCLE_COLOR),
          e.setAttribute('stroke-width', u.CIRCLE_STRONG * u.SYMBOL_SCALE),
          t.appendChild(e),
          (e = this.paper.circle(
            this.cx,
            this.cy,
            this.radius - this.radius / u.INNER_CIRCLE_RADIUS_RATIO,
          )).setAttribute('stroke', u.CIRCLE_COLOR),
          e.setAttribute('stroke-width', u.CIRCLE_STRONG * u.SYMBOL_SCALE),
          t.appendChild(e));
      }),
      (u.Radix.prototype.transit = function (t) {
        u.utils.getEmptyWrapper(this.universe, u._paperElementId + '-' + u.ID_RADIX + '-' + u.ID_AXIS);
        t = new u.Transit(S, t);
        return (t.drawBg(), t.drawPoints(), t.drawCusps(), t.drawRuler(), t.drawCircles(), t);
      }));
  })((window.astrology = window.astrology || {})),
  (function (u) {
    var o;
    ((u.Transit = function (t, e) {
      var s = u.utils.validate(e);
      if (s.hasError) throw new Error(s.messages);
      return (
        (this.data = e),
        (this.paper = t.paper),
        (this.cx = t.cx),
        (this.cy = t.cy),
        (this.toPoints = t.toPoints),
        (this.radius = t.radius),
        (this.rulerRadius = this.radius / u.INNER_CIRCLE_RADIUS_RATIO / u.RULER_RADIUS),
        (this.pointRadius = this.radius + (this.radius / u.INNER_CIRCLE_RADIUS_RATIO + u.PADDING * u.SYMBOL_SCALE)),
        (this.shift = t.shift),
        (this.universe = document.createElementNS(this.paper.root.namespaceURI, 'g')),
        this.universe.setAttribute('id', this.paper.elementId + '-' + u.ID_TRANSIT),
        this.paper.root.appendChild(this.universe),
        (o = this)
      );
    }),
      (u.Transit.prototype.drawBg = function () {
        var t = this.universe,
          t = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_BG),
          e = this.paper.segment(
            this.cx,
            this.cy,
            this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO,
            0,
            359.99,
            this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
            1,
          );
        (e.setAttribute('fill', u.STROKE_ONLY ? 'none' : u.COLOR_BACKGROUND), t.appendChild(e));
      }),
      (u.Transit.prototype.drawPoints = function (t) {
        var i = null == t ? this.data.planets : t;
        if (null != i) {
          var r,
            a,
            e,
            s,
            t = this.universe,
            n = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_TRANSIT + '-' + u.ID_POINTS),
            o =
              (this.radius,
              this.radius,
              u.INNER_CIRCLE_RADIUS_RATIO,
              this.radius,
              u.INDOOR_CIRCLE_RADIUS_RATIO,
              u.PADDING,
              u.SYMBOL_SCALE,
              Object.keys(i).length,
              this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO);
          for (e in ((this.locatedPoints = []), i))
            i.hasOwnProperty(e) &&
              ((s = {
                name: e,
                x: (s = u.utils.getPointPosition(this.cx, this.cy, this.pointRadius, i[e][0] + this.shift)).x,
                y: s.y,
                r: u.COLLISION_RADIUS * u.SYMBOL_SCALE,
                angle: i[e][0] + this.shift,
                pointer: i[e][0] + this.shift,
              }),
              (this.locatedPoints = u.utils.assemble(this.locatedPoints, s, {
                cx: this.cx,
                cy: this.cy,
                r: this.pointRadius,
              })));
          (u.DEBUG && console.log('Transit count of points: ' + this.locatedPoints.length),
            u.DEBUG && console.log('Transit located points:\n' + JSON.stringify(this.locatedPoints)),
            this.locatedPoints.forEach(function (t) {
              ((r = u.utils.getPointPosition(this.cx, this.cy, o, i[t.name][0] + this.shift)),
                (a = u.utils.getPointPosition(this.cx, this.cy, o + this.rulerRadius / 2, i[t.name][0] + this.shift)));
              var e = this.paper.line(r.x, r.y, a.x, a.y),
                e =
                  (e.setAttribute('stroke', u.CIRCLE_COLOR),
                  e.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
                  n.appendChild(e),
                  u.STROKE_ONLY ||
                    i[t.name][0] + this.shift == t.angle ||
                    ((r = a),
                    (a = u.utils.getPointPosition(
                      this.cx,
                      this.cy,
                      this.pointRadius - u.COLLISION_RADIUS * u.SYMBOL_SCALE,
                      t.angle,
                    )),
                    (e = this.paper.line(r.x, r.y, a.x, a.y)).setAttribute('stroke', u.LINE_COLOR),
                    e.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE * 0.5),
                    n.appendChild(e)),
                  this.paper.getSymbol(t.name, t.x, t.y)),
                e =
                  (e.setAttribute('id', u._paperElementId + '-' + u.ID_TRANSIT + '-' + u.ID_POINTS + '-' + t.name),
                  n.appendChild(e),
                  [(Math.round(i[t.name][0]) % 30).toString()]),
                s = new u.Zodiac(this.data.cusps);
              (i[t.name][1] && s.isRetrograde(i[t.name][1]) ? e.push('R') : e.push(''),
                (e = e.concat(
                  s
                    .getDignities({ name: t.name, position: i[t.name][0] }, u.DIGNITIES_EXACT_EXALTATION_DEFAULT)
                    .join(','),
                )),
                u.utils.getDescriptionPosition(t, e).forEach(function (t) {
                  n.appendChild(this.paper.text(t.text, t.x, t.y, u.POINTS_TEXT_SIZE, u.SIGNS_COLOR));
                }, this));
            }, this));
        }
      }),
      (u.Transit.prototype.drawCircles = function () {
        var t = this.universe,
          t = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_TRANSIT + '-' + u.ID_CIRCLES),
          e = this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO,
          e = this.paper.circle(this.cx, this.cy, e);
        (e.setAttribute('stroke', u.CIRCLE_COLOR),
          e.setAttribute('stroke-width', u.CIRCLE_STRONG * u.SYMBOL_SCALE),
          t.appendChild(e));
      }),
      (u.Transit.prototype.drawCusps = function (t) {
        var e = null == t ? this.data.cusps : t;
        if (null != e)
          for (
            var t = this.universe,
              s = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_TRANSIT + '-' + u.ID_CUSPS),
              i = this.radius + (this.radius / u.INNER_CIRCLE_RADIUS_RATIO - this.rulerRadius) / 2,
              r = 0,
              a = e.length;
            r < a;
            r++
          ) {
            var n = (bottomPosition = u.utils.getPointPosition(this.cx, this.cy, this.radius, e[r] + this.shift)),
              o = u.utils.getPointPosition(
                this.cx,
                this.cy,
                this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO - this.rulerRadius,
                e[r] + this.shift,
              ),
              o =
                ((n = this.paper.line(n.x, n.y, o.x, o.y)).setAttribute('stroke', u.LINE_COLOR),
                n.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
                s.appendChild(n),
                u.utils.radiansToDegree(2 * Math.PI)),
              n = e[r],
              S = e[(r + 1) % 12],
              S = u.utils.getPointPosition(
                this.cx,
                this.cy,
                i,
                ((n + (0 < S - n ? S - n : S - n + o) / 2) % o) + this.shift,
              );
            s.appendChild(this.paper.getSymbol((r + 1).toString(), S.x, S.y));
          }
      }),
      (u.Transit.prototype.drawRuler = function () {
        var t = this.universe,
          e = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_TRANSIT + '-' + u.ID_RULER),
          t = this.radius + this.radius / u.INNER_CIRCLE_RADIUS_RATIO;
        (u.utils.getRulerPositions(this.cx, this.cy, t, t - this.rulerRadius, this.shift).forEach(function (t) {
          t = this.paper.line(t.startX, t.startY, t.endX, t.endY);
          (t.setAttribute('stroke', u.CIRCLE_COLOR),
            t.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
            e.appendChild(t));
        }, this),
          (t = this.paper.circle(this.cx, this.cy, t - this.rulerRadius)).setAttribute('stroke', u.CIRCLE_COLOR),
          t.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
          e.appendChild(t));
      }),
      (u.Transit.prototype.aspects = function (t) {
        for (
          var e = null != t && Array.isArray(t) ? t : new u.AspectCalculator(this.toPoints).transit(this.data.planets),
            t = this.universe,
            s = u.utils.getEmptyWrapper(t, u._paperElementId + '-' + u.ID_ASPECTS),
            i = 0,
            r = e.length;
          i < r;
          i++
        ) {
          var a = u.utils.getPointPosition(
              this.cx,
              this.cy,
              this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
              e[i].toPoint.position + this.shift,
            ),
            n = u.utils.getPointPosition(
              this.cx,
              this.cy,
              this.radius / u.INDOOR_CIRCLE_RADIUS_RATIO,
              e[i].point.position + this.shift,
            ),
            a = this.paper.line(a.x, a.y, n.x, n.y);
          (a.setAttribute('stroke', u.STROKE_ONLY ? u.LINE_COLOR : e[i].aspect.color),
            a.setAttribute('stroke-width', u.CUSPS_STROKE * u.SYMBOL_SCALE),
            a.setAttribute('data-name', e[i].aspect.name),
            a.setAttribute('data-degree', e[i].aspect.degree),
            a.setAttribute('data-point', e[i].point.name),
            a.setAttribute('data-toPoint', e[i].toPoint.name),
            a.setAttribute('data-precision', e[i].precision),
            s.appendChild(a));
        }
        return o;
      }),
      (u.Transit.prototype.animate = function (t, e, s, i) {
        var r = u.utils.validate(t);
        if (r.hasError) throw new Error(r.messages);
        return (
          u.utils.getEmptyWrapper(this.universe, u._paperElementId + '-' + u.ID_ASPECTS),
          new u.Animator(o).animate(
            t,
            e,
            s,
            function () {
              ((this.data = t), this.drawPoints(), this.drawCusps(), this.aspects(), 'function' == typeof i && i());
            }.bind(this),
          ),
          o
        );
      }));
  })((window.astrology = window.astrology || {})),
  (function (n) {
    function o(t, e, s) {
      var i = !1,
        t = Math.abs(t - e),
        e =
          (t > n.utils.radiansToDegree(Math.PI) && (t = n.utils.radiansToDegree(2 * Math.PI) - t),
          s.degree - s.orbit / 2),
        s = s.degree + s.orbit / 2;
      return (i = e <= t && t <= s ? !0 : i);
    }
    function S(t, e, s) {
      t = Math.abs(t - e);
      return (t > n.utils.radiansToDegree(Math.PI) && (t = n.utils.radiansToDegree(2 * Math.PI) - t), Math.abs(t - s));
    }
    function u(t, e) {
      return t.precision - e.precision;
    }
    ((n.AspectCalculator = function (t, e) {
      if (null == t) throw new Error("Param 'toPoint' must not be empty.");
      return (
        (this.settings = e || {}),
        (this.settings.aspects = (e && e.aspects) || n.ASPECTS),
        (this.toPoints = t),
        this
      );
    }),
      (n.AspectCalculator.prototype.getToPoints = function () {
        return this.this.toPoints;
      }),
      (n.AspectCalculator.prototype.radix = function (t) {
        if (!t) return [];
        var e,
          s = [];
        for (e in t)
          if (t.hasOwnProperty(e))
            for (var i in this.toPoints)
              if (this.toPoints.hasOwnProperty(i) && e != i)
                for (var r in this.settings.aspects)
                  o(t[e][0], this.toPoints[i][0], this.settings.aspects[r]) &&
                    s.push({
                      aspect: {
                        name: r,
                        degree: this.settings.aspects[r].degree,
                        orbit: this.settings.aspects[r].orbit,
                        color: this.settings.aspects[r].color,
                      },
                      point: { name: e, position: t[e][0] },
                      toPoint: { name: i, position: this.toPoints[i][0] },
                      precision: S(t[e][0], this.toPoints[i][0], this.settings.aspects[r].degree).toFixed(4),
                    });
        return s.sort(u);
      }),
      (n.AspectCalculator.prototype.transit = function (t) {
        if (!t) return [];
        var e,
          s,
          i = [];
        for (e in t)
          if (t.hasOwnProperty(e))
            for (var r in this.toPoints)
              if (this.toPoints.hasOwnProperty(r))
                for (var a in this.settings.aspects)
                  o(t[e][0], this.toPoints[r][0], this.settings.aspects[a]) &&
                    ((s = S(t[e][0], this.toPoints[r][0], this.settings.aspects[a].degree)),
                    (function (t, e, s) {
                      0 < s - e
                        ? s - e > n.utils.radiansToDegree(Math.PI)
                          ? (s = (s + t) % n.utils.radiansToDegree(2 * Math.PI))
                          : (e = (e + t) % n.utils.radiansToDegree(2 * Math.PI))
                        : e - s > n.utils.radiansToDegree(Math.PI)
                          ? (e = (e + t) % n.utils.radiansToDegree(2 * Math.PI))
                          : (s = (s + t) % n.utils.radiansToDegree(2 * Math.PI));
                      var t = s,
                        i = e,
                        r = t - i;
                      Math.abs(r) > n.utils.radiansToDegree(Math.PI) && ((t = e), (i = s));
                      return t - i < 0;
                    })(this.settings.aspects[a].degree, this.toPoints[r][0], t[e][0]) && (s *= -1),
                    t[e][1] && t[e][1] < 0 && (s *= -1),
                    i.push({
                      aspect: {
                        name: a,
                        degree: this.settings.aspects[a].degree,
                        orbit: this.settings.aspects[a].orbit,
                        color: this.settings.aspects[a].color,
                      },
                      point: { name: e, position: t[e][0] },
                      toPoint: { name: r, position: this.toPoints[r][0] },
                      precision: s.toFixed(4),
                    }));
        return i.sort(u);
      }));
  })((window.astrology = window.astrology || {})),
  (function (n) {
    ((n.Zodiac = function (t, e) {
      if (null == t) throw new Error("Param 'cusps' must not be empty.");
      if (Array.isArray(t) && 12 == t.length) return ((this.cusps = t), (this.settings = e || {}), this);
      throw new Error("Param 'cusps' is not 12 length Array.");
    }),
      (n.Zodiac.prototype.getSign = function (t) {
        t %= n.utils.radiansToDegree(2 * Math.PI);
        return Math.floor(t / 30 + 1);
      }),
      (n.Zodiac.prototype.isRetrograde = function (t) {
        return t < 0;
      }),
      (n.Zodiac.prototype.getHouseNumber = function (t) {
        for (var e = t % n.utils.radiansToDegree(2 * Math.PI), s = 0, i = this.cusps.length; s < i; s++)
          if (e >= this.cusps[s] && e < this.cusps[(s % (i - 1)) + 1]) return s + 1;
        for (s = 0, i = this.cusps.length; s < i; s++) if (this.cusps[s] > this.cusps[(s % (i - 1)) + 1]) return s + 1;
        throw new Error("Oops, serious error in the method: 'astrology.Zodiac.getHouseNumber'.");
      }),
      (n.Zodiac.prototype.getDignities = function (t, e) {
        if (!t || !t.name || null == t.position) return [];
        var s = [],
          i = this.getSign(t.position);
        (t.position, n.utils.radiansToDegree(2 * Math.PI));
        switch (t.name) {
          case n.SYMBOL_SUN:
            (5 == i ? s.push(n.DIGNITIES_RULERSHIP) : 11 == i && s.push(n.DIGNITIES_DETRIMENT),
              1 == i ? s.push(n.DIGNITIES_EXALTATION) : 6 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_MOON:
            (4 == i ? s.push(n.DIGNITIES_RULERSHIP) : 10 == i && s.push(n.DIGNITIES_DETRIMENT),
              2 == i ? s.push(n.DIGNITIES_EXALTATION) : 8 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_MERCURY:
            (3 == i ? s.push(n.DIGNITIES_RULERSHIP) : 9 == i && s.push(n.DIGNITIES_DETRIMENT),
              6 == i ? s.push(n.DIGNITIES_EXALTATION) : 12 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_VENUS:
            (2 == i || 7 == i ? s.push(n.DIGNITIES_RULERSHIP) : (1 != i && 8 != i) || s.push(n.DIGNITIES_DETRIMENT),
              12 == i ? s.push(n.DIGNITIES_EXALTATION) : 6 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_MARS:
            (1 == i || 8 == i ? s.push(n.DIGNITIES_RULERSHIP) : (2 != i && 7 != i) || s.push(n.DIGNITIES_DETRIMENT),
              10 == i ? s.push(n.DIGNITIES_EXALTATION) : 4 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_JUPITER:
            (9 == i || 12 == i ? s.push(n.DIGNITIES_RULERSHIP) : (3 != i && 6 != i) || s.push(n.DIGNITIES_DETRIMENT),
              4 == i ? s.push(n.DIGNITIES_EXALTATION) : 10 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_SATURN:
            (10 == i || 11 == i ? s.push(n.DIGNITIES_RULERSHIP) : (4 != i && 5 != i) || s.push(n.DIGNITIES_DETRIMENT),
              7 == i ? s.push(n.DIGNITIES_EXALTATION) : 1 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_URANUS:
            (11 == i ? s.push(n.DIGNITIES_RULERSHIP) : 5 == i && s.push(n.DIGNITIES_DETRIMENT),
              8 == i ? s.push(n.DIGNITIES_EXALTATION) : 2 == i && s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_NEPTUNE:
            (12 == i ? s.push(n.DIGNITIES_RULERSHIP) : 6 == i && s.push(n.DIGNITIES_DETRIMENT),
              5 == i || 9 == i ? s.push(n.DIGNITIES_EXALTATION) : (11 != i && 3 != i) || s.push(n.DIGNITIES_FALL));
            break;
          case n.SYMBOL_PLUTO:
            (8 == i ? s.push(n.DIGNITIES_RULERSHIP) : 2 == i && s.push(n.DIGNITIES_DETRIMENT),
              1 == i ? s.push(n.DIGNITIES_EXALTATION) : 7 == i && s.push(n.DIGNITIES_FALL));
        }
        if (null != e && Array.isArray(e))
          for (var r = 0, a = e.length; r < a; r++)
            t.name != e[r].name ||
              !(function (t, e, s) {
                var i = !1,
                  r = e - s / 2 < 0 ? n.utils.radiansToDegree(2 * Math.PI) - (e - s / 2) : e - s / 2,
                  e =
                    e + s / 2 >= n.utils.radiansToDegree(2 * Math.PI)
                      ? e + s / 2 - n.utils.radiansToDegree(2 * Math.PI)
                      : e + s / 2;
                e < r ? t <= r && (i = !0) : r <= t && t <= e && (i = !0);
                return i;
              })(t.position, e[r].position, e[r].orbit) ||
              s.push(n.DIGNITIES_EXACT_EXALTATION);
        return s;
      }),
      (n.Zodiac.prototype.toDMS = function (t) {
        t += 0.5 / 3600 / 1e4;
        var e = parseInt(t),
          s = ((t = 60 * (t - e)), parseInt(t));
        return ((t = 60 * (t - s)), e + '° ' + s + "' " + parseInt(t));
      }));
  })((window.astrology = window.astrology || {})),
  (function (t) {
    ((t.Timer = function (t) {
      if ('function' != typeof t) throw new Error("param 'callback' has to be a function.");
      return ((this.callback = t), (this.boundTick_ = this.tick.bind(this)), this);
    }),
      (t.Timer.prototype.start = function () {
        this.requestID_ ||
          ((this.lastGameLoopFrame = new Date().getTime()),
          this.tick(),
          t.DEBUG && console.log('[astrology.Timer] start'));
      }),
      (t.Timer.prototype.stop = function () {
        this.requestID_ &&
          (window.cancelAnimationFrame(this.requestID_), (this.requestID_ = void 0), t.DEBUG) &&
          console.log('[astrology.Timer] stop');
      }),
      (t.Timer.prototype.isRunning = function () {
        return !!this.requestID_;
      }),
      (t.Timer.prototype.tick = function () {
        var t = new Date().getTime();
        ((this.requestID_ = window.requestAnimationFrame(this.boundTick_)),
          this.callback(t - this.lastGameLoopFrame),
          (this.lastGameLoopFrame = t));
      }));
  })((window.astrology = window.astrology || {})),
  (function (S) {
    var u;
    ((S.Animator = function (t) {
      for (var e in ((this.transit = t), (this.actualPlanetPos = {}), this.transit.data.planets))
        this.actualPlanetPos[e] = this.transit.data.planets[e];
      return ((this.timer = new S.Timer(this.update.bind(this))), (this.timeSinceLoopStart = 0), (u = this));
    }),
      (S.Animator.prototype.animate = function (t, e, s, i) {
        ((this.data = t),
          (this.duration = 1e3 * e),
          (this.isReverse = s || !1),
          (this.callback = i),
          (this.rotation = 0),
          (this.cuspsElement = document.getElementById(S._paperElementId + '-' + S.ID_TRANSIT + '-' + S.ID_CUSPS)),
          this.timer.start());
      }),
      (S.Animator.prototype.update = function (t) {
        if (((this.timeSinceLoopStart += t = t || 1), this.timeSinceLoopStart >= this.duration))
          (this.timer.stop(), 'function' == typeof this.callback && this.callback());
        else {
          var e,
            t =
              this.duration - this.timeSinceLoopStart < t
                ? 1
                : Math.round((this.duration - this.timeSinceLoopStart) / t),
            s = t;
          for (e in u.data.planets) {
            var i = u.actualPlanetPos[e][0],
              r = u.data.planets[e][0],
              a = null != u.actualPlanetPos[e][1] && u.actualPlanetPos[e][1] < 0,
              r =
                ((r = (!u.isReverse || !a) && (u.isReverse || a) ? i - r : r - i) < 0 &&
                  (r += S.utils.radiansToDegree(2 * Math.PI)),
                r / s),
              a = (u.isReverse && (r *= -1), a && (r *= -1), i + r);
            (a < 0 && (a += S.utils.radiansToDegree(2 * Math.PI)), (u.actualPlanetPos[e][0] = a));
          }
          u.transit.drawPoints(u.actualPlanetPos);
          var n = S.utils.radiansToDegree(2 * Math.PI),
            o = u.transit.data.cusps[0] - u.data.cusps[0];
          (o < 0 && (o += n),
            0 < S.ANIMATION_CUSPS_ROTATION_SPEED &&
              (o += u.isReverse
                ? -1 * (S.ANIMATION_CUSPS_ROTATION_SPEED * n + n)
                : S.ANIMATION_CUSPS_ROTATION_SPEED * n),
            (o = u.isReverse ? u.rotation - o : o - u.rotation) < 0 && (o += n),
            (n = o / t),
            u.isReverse && (n *= -1),
            (u.rotation += n),
            u.cuspsElement.setAttribute(
              'transform',
              'rotate(' + u.rotation + ' ' + u.transit.cx + ' ' + u.transit.cy + ')',
            ),
            1 == t && u.cuspsElement.removeAttribute('transform'));
        }
      }));
  })((window.astrology = window.astrology || {})),
  (function (_) {
    ((_.utils = {}),
      (_.utils.getPointPosition = function (t, e, s, i) {
        i = ((_.SHIFT_IN_DEGREES - i) * Math.PI) / 180;
        return { x: t + s * Math.cos(i), y: e + s * Math.sin(i) };
      }),
      (_.utils.degreeToRadians = function (t) {
        return (degrees * Math.PI) / 180;
      }),
      (_.utils.radiansToDegree = function (t) {
        return (180 * t) / Math.PI;
      }),
      (_.utils.getDescriptionPosition = function (t, e) {
        var s = [],
          i = t.x + (_.COLLISION_RADIUS / 1.4) * _.SYMBOL_SCALE,
          r = t.y - _.COLLISION_RADIUS * _.SYMBOL_SCALE;
        return (
          e.forEach(function (t, e) {
            s.push({ text: t, x: i, y: r + (_.COLLISION_RADIUS / 1.4) * _.SYMBOL_SCALE * e });
          }, this),
          s
        );
      }),
      (_.utils.validate = function (t) {
        var e = { hasError: !1, messages: [] };
        if (null == t) (e.messages.push('Data is not set.'), (e.hasError = !0));
        else {
          for (var s in (null == t.planets && (e.messages.push("There is not property 'planets'."), (e.hasError = !0)),
          t.planets))
            !t.planets.hasOwnProperty(s) ||
              Array.isArray(t.planets[s]) ||
              (e.messages.push("The planets property '" + s + "' has to be Array."), (e.hasError = !0));
          (null == t.cusps ||
            Array.isArray(t.cusps) ||
            (e.messages.push("Property 'cusps' has to be Array."), (e.hasError = !0)),
            null != t.cusps &&
              12 != t.cusps.length &&
              (e.messages.push("Count of 'cusps' values has to be 12."), (e.hasError = !0)));
        }
        return e;
      }),
      (_.utils.getEmptyWrapper = function (t, e) {
        var s = document.getElementById(e);
        return (
          s
            ? _.utils.removeChilds(s)
            : ((s = document.createElementNS(
                document.getElementById(_._paperElementId).namespaceURI,
                'g',
              )).setAttribute('id', e),
              t.appendChild(s)),
          s
        );
      }),
      (_.utils.removeChilds = function (t) {
        if (null != t) for (var e; (e = t.lastChild); ) t.removeChild(e);
      }),
      (_.utils.isCollision = function (t, e) {
        var s = t.x - e.x,
          i = t.y - e.y;
        return Math.sqrt(s * s + i * i) <= t.r + e.r;
      }),
      (_.utils.assemble = function (t, e, s) {
        if (0 == t.length) t.push(e);
        else {
          if (2 * Math.PI * s.r - _.COLLISION_RADIUS * _.SYMBOL_SCALE * 2 * (t.length + 2) <= 0)
            throw (
              _.DEBUG &&
                console.log(
                  'Universe circumference: ' +
                    2 * Math.PI * s.r +
                    ', Planets circumference: ' +
                    _.COLLISION_RADIUS * _.SYMBOL_SCALE * 2 * (t.length + 2),
                ),
              new Error('Unresolved planet collision. Try change SYMBOL_SCALE or paper size.')
            );
          var i = !1;
          t.sort(_.utils.comparePoints);
          for (var r, a = 0, n = t.length; a < n; a++)
            if (_.utils.isCollision(t[a], e)) {
              var i = !0,
                o = t[a];
              ((o.index = a), _.DEBUG && console.log('Resolve collision: ' + o.name + ' X ' + e.name));
              break;
            }
          (i
            ? (_.utils.placePointsInCollision(o, e),
              (r = _.utils.getPointPosition(s.cx, s.cy, s.r, o.angle)),
              (o.x = r.x),
              (o.y = r.y),
              (r = _.utils.getPointPosition(s.cx, s.cy, s.r, e.angle)),
              (e.x = r.x),
              (e.y = r.y),
              t.splice(o.index, 1),
              (t = _.utils.assemble(t, o, s)),
              (t = _.utils.assemble(t, e, s)))
            : t.push(e),
            t.sort(_.utils.comparePoints));
        }
        return t;
      }),
      (_.utils.placePointsInCollision = function (t, e) {
        var s = null == t.pointer ? t.angle : t.pointer,
          i = null == e.pointer ? e.angle : e.pointer;
        (180 < Math.abs(s - i) && ((s = (s + 180) % 360), (i = (i + 180) % 360)),
          s <= i
            ? ((t.angle = t.angle - 1), (e.angle = e.angle + 1))
            : i <= s && ((t.angle = t.angle + 1), (e.angle = e.angle - 1)),
          (t.angle = (t.angle + 360) % 360),
          (e.angle = (e.angle + 360) % 360));
      }),
      (_.utils.isInCollision = function (t, e) {
        for (
          var s = _.utils.radiansToDegree(2 * Math.PI),
            i = (_.COLLISION_RADIUS * _.SYMBOL_SCALE) / 2,
            r = !1,
            a = 0,
            n = e.length;
          a < n;
          a++
        )
          if (Math.abs(e[a].angle - t) <= i || s - Math.abs(e[a].angle - t) <= i) {
            r = !0;
            break;
          }
        return r;
      }),
      (_.utils.getDashedLinesPositions = function (t, e, s, i, r, a, n) {
        var o,
          S,
          u = [];
        return (
          _.utils.isInCollision(s, n)
            ? ((o = _.utils.getPointPosition(t, e, i, s)),
              (S = _.utils.getPointPosition(t, e, a - _.COLLISION_RADIUS * _.SYMBOL_SCALE, s)),
              u.push({ startX: o.x, startY: o.y, endX: S.x, endY: S.y }),
              a + _.COLLISION_RADIUS * _.SYMBOL_SCALE * 2 < r &&
                ((o = _.utils.getPointPosition(t, e, a + _.COLLISION_RADIUS * _.SYMBOL_SCALE * 2, s)),
                (S = _.utils.getPointPosition(t, e, r, s)),
                u.push({ startX: o.x, startY: o.y, endX: S.x, endY: S.y })))
            : ((o = _.utils.getPointPosition(t, e, i, s)),
              (S = _.utils.getPointPosition(t, e, r, s)),
              u.push({ startX: o.x, startY: o.y, endX: S.x, endY: S.y })),
          u
        );
      }),
      (_.utils.getRulerPositions = function (t, e, s, i, r) {
        for (
          var a = [], n = i, o = s <= i ? n - Math.abs(i - s) / 2 : n + Math.abs(i - s) / 2, S = 0, u = 0;
          S < 72;
          S++
        ) {
          var L = u + r,
            A = _.utils.getPointPosition(t, e, s, L),
            L = _.utils.getPointPosition(t, e, S % 2 == 0 ? n : o, L);
          (a.push({ startX: A.x, startY: A.y, endX: L.x, endY: L.y }), (u += 5));
        }
        return a;
      }),
      (_.utils.comparePoints = function (t, e) {
        return t.angle - e.angle;
      }));
  })((window.astrology = window.astrology || {})));
