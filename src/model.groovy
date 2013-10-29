def findById(id) {
  g.v(id)
}

def findOne(key, value) {
  g.V(key, value)
}

def delete(id) {
  g.removeVertex(g.v(id))
}
