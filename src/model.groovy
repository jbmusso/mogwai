def findById(id) {
  g.v(id)
}

def findByKeyValue(key, value) {
  g.V(key, value)
}

def delete(id) {
  g.removeVertex(g.v(id))
}

def update(id, m) {
  m.each{g.v(id).setProperty(it.key, it.value)}
}
