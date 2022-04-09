async function deleteFormHandler(event) {
  event.preventDefault();
  

  const id = event.target.id;
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    document.location.replace('/dashboard/');
  } else {
    alert(response.statusText);
  }
}

//document.querySelector('.button-59').addEventListener('click', deleteFormHandler);
