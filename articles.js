{
  attachments: {
    content: {
      extension: 'md'
    }
  },
  sort: function(a1, a2) {
    var d1 = new Date(a1.date);
    var d2 = new Date(a2.date);
    return d1 > d2 ? -1
         : d1 < d2 ? 1
         : 0;
  },
  access: {
    get: 'all'
  }
}
